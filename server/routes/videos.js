var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conn = mongoose.connection;
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
var storage = GridFsStorage({
    gfs: gfs,
    filename: function (req, file, cb) {
        console.log(file);
        var datetimestamp = Date.now();
        const extension = file.mimetype.split('/')[1];
        // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        cb(null, datetimestamp + `.${extension}`);
    },
    /** With gridfs we can store aditional meta-data along with the file */
    metadata: function (req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'videoFiles' //root name for collection to store files into
});
var upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');


router.post('/upload', function (req, res) {
    console.log(req.file);
    upload(req, res, function (err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        var fullUrl = req.protocol + '://' + req.get('host') + '/app/api/videos/uploadedfiles/' + req.file.filename;
        res.json({ success: true, url: fullUrl, video_name: req.file.filename });
    });
});

router.get('/uploadedfiles/:filename', function (req, res) {
    gfs.collection('videoFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }
        /** create read stream */
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "videoFiles"
        });
        /** set the proper content type */
        res.set('Content-Type', files[0].contentType)
        /** return response */
        return readstream.pipe(res);

        //res.json({ data: files });
    });
});

router.delete('/uploadedfiles/:filename', function (req, res) {
    gfs.collection('videoFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }
        gfs.files.remove({ _id: files[0]._id }, function (err, data) {
            if (err) return false;
            // return true;
            res.json({ success: true, data: 'File deleted successfully' });
        })
    });
});

router.get('/uploadedfiles', function (req, res) {
    gfs.collection('videoFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({}).toArray(function (err, files) {
        res.json({ success: true, data: files });
    });
});

module.exports = router;