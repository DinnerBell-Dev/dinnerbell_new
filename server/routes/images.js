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
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        const extension = file.mimetype.split('/')[1];
        // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        cb(null, datetimestamp + `.${extension}`);
    },
    /** With gridfs we can store aditional meta-data along with the file */
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'ctFiles' //root name for collection to store files into
});
var upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

var uploadMultiple = multer({ storage: storage }).array('slideShow', 5);

router.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        var fullUrl = req.protocol + '://' + req.get('host') + '/app/api/images/uploadedfiles/' + req.file.filename;
        res.json({ success: true, url: fullUrl, photo_name: req.file.filename });
    });
});

router.get('/uploadedfiles/:filename', function(req, res) {
    gfs.collection('ctFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function(err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        /** create read stream */
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "ctFiles"
        });
        /** set the proper content type */
        res.set('Content-Type', files[0].contentType)
            /** return response */
        return readstream.pipe(res);

        //res.json({ data: files });
    });
});

router.delete('/uploadedfiles/:filename', function(req, res) {
    gfs.collection('ctFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function(err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        gfs.files.remove({ _id: files[0]._id }, function(err, data) {
            if (err) return false;
            // return true;
            res.json({ success: true, data: 'File deleted successfully' });
        })
    });
});

router.get('/uploadedfiles', function(req, res) {
    gfs.collection('ctFiles'); //set collection name to lookup into
    /** First check if file exists */
    gfs.files.find({}).toArray(function(err, files) {
        res.json({ success: true, data: files });
    });
});

router.post('/uploadMultiple', function(req, res) {
    uploadMultiple(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        var slideShow = [];
        req.files.forEach(element => {
            console.log(element);
            var fullUrl = req.protocol + '://' + req.get('host') + '/app/api/images/uploadedfiles/' + element.filename;
            var imagedata = { url: fullUrl, photo_name: element.filename };
            slideShow.push(imagedata);
        });
        res.json({ success: true, uploadedFiles: slideShow });
    });
});

module.exports = router;