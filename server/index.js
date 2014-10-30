var path = require('path'),
    express = require('express'),
    ecstatic = require('ecstatic');

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
// Use Ecstatic to serve public files with gzip if supported.
app.use( ecstatic( { root: publicDir, gzip: true } ) );

// Index.
app.get( '/', function ( req, res ) {
    res.redirect( publicDir + '/index.html' );
});

// 404.
app.get( '/*', function ( req, res ) {
    res.status( 404 );
    res.render( publicDir + '/#/404', 404 );
});

//TODO:serve favicon
//http://stackoverflow.com/questions/15463199/how-to-set-custom-favicon-in-node-js-express

// TODO:API
//require('./api/whatever')(app);

// Start the server.
var server = app.listen( port, function () {
    console.log( 'In %s mode. Listening on port %d.', environment, server.address().port );
});