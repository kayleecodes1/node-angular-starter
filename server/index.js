var path = require('path'),
    express = require('express'),
    ecstatic = require('ecstatic'),
    favicon = require('serve-favicon');

var cfg = require('../build.config.js');

process.title = process.env.npm_package_config_processName;

var app = express(),
    environment = process.env.npm_config_dev ? 'development' : 'production',
    port = parseInt( process.env.npm_config_port, 10 ) || process.env.npm_package_config_defaultPort;

// Set up the static directory.
var publicDir = path.join( __dirname, '..' );
if( environment === 'development' ) {
    publicDir = path.join( publicDir, cfg.build_dir );
} else {
    publicDir = path.join( publicDir, cfg.compile_dir );
}

// Use Ecstatic to serve static files.
app.use( ecstatic( { root: publicDir, gzip: true } ) );

// Favicon.
app.use( favicon( path.join( publicDir, 'assets', 'favicon.ico' ) ) );

// Index.
app.get( '/', function ( req, res ) {
    res.redirect( path.join( publicDir, 'index.html' ) );
});

// API: user.
app.get( '/api/user', function ( req, res ) {
    var userInfo = {
        username: 'testuser',
        fullName: 'Test User',
        created: new Date()
    };
    res.writeHead( 200, { 'Content-Type' : 'application/json' } );
    res.end( JSON.stringify( userInfo ) );
});

//TODO:serve favicon
//http://stackoverflow.com/questions/15463199/how-to-set-custom-favicon-in-node-js-express

// TODO:API
//require('./api/whatever')(app);

// Start the server.
var server = app.listen( port, function () {
    console.log( 'In %s mode. Listening on port %d.', environment, server.address().port );
});