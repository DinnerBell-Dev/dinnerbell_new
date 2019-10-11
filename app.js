var express = require('express');
var cors = require('cors')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./server/config/database');
const verifyToken = require("./server/lib/verifyToken");
/**
 * connect to mongodb via mongoose.
 */
mongoose.connect(config.database);

/**
 * variables to specify app routes.
 */
var restaurant = require('./server/routes/restaurant');
var order = require('./server/routes/order');
var users = require('./server/routes/users');
var admin = require('./server/routes/admin');
var guest = require('./server/routes/guest')
var server = require('./server/routes/server')
var return_guest = require('./server/routes/return_guest')

var admin_auth = require('./server/routes/admin/auth')
var admin_user = require('./server/routes/admin/user')
var verifyphone = require('./server/routes/verify');
var images = require('./server/routes/images');
var videos = require('./server/routes/videos');
var settings = require('./server/routes/settings');
const theme_setting = require('./server/routes/theme_settings');
var app = express();

/**
 * To check if api key is set or not in database.js file.
 */
if (!config.API_KEY) {
    console.log("Please set your ACCOUNT_SECURITY_API_KEY environment variable before proceeding.");
    process.exit(1);
}

/**
 * View engine setup for backend ui.
 */
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

/**
 * Use cors for http headers.
 */
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/**
 * Serving index.html from dist
 */
app.use(express.static(path.join(__dirname + '/dist/dinnerbell')));

/**
 * Used liberaries for node backend
 */
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());

app.use(function (req, res, next) {
    req.getUrl = req.protocol + "://" + req.get('host') + "/"
    return next();
});

/**
 * App parent(base) routes.
 */
app.use('/api/restaurant', restaurant);
app.use('/api/order', order);
app.use('/api/user', users);
app.use('/api/admin', admin);
app.use('/api/guest', guest);
app.use('/api/server', server);
app.use('/api/return_guest', return_guest);

/**
 * Admin API routes.
 */
app.use('/admin/auth', admin_auth);
app.use('/admin/user', admin_user);

/**
 * Account Security Phone Verification API.(Twillio)
 */
app.use('/api/verification', verifyphone);

/**
 * Used to store all the images
 */
app.use('/api/images', images);

/**
 * Used to store all the settings related to user
 */
app.use('/api/settings', settings);

/**
 * Used to store all the videos
 */
app.use('/api/videos', videos);

/**
 * Theme setting api
 */
app.use('/api/theme-setting', theme_setting);


/**
 * Send all other requests to the Angular app
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/dinnerbell/index.html'));
});

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    return res.json({ err: err })
});

/**
 * Set the port to use
 */
const port = parseInt(process.env.PORT, 10) || 3000;

/**
 * Start the server
 */
const serverApp = app.listen(port, () => {
    console.log(`App is running at: localhost:${serverApp.address().port}`);
});