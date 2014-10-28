var path = require('path'),
    express = require('express');

var cfg = require('../build.config.js');

process.title = process.env.npm_package_config_processName;

var app = express(),
    environment = process.env.npm_config_dev ? 'development' : 'production',
    port = parseInt( process.env.npm_config_port, 10 ) || process.env.npm_package_config_defaultPort;

// Set up the static directory.
var public_dir = path.join( __dirname, '..' );
if( environment === 'development' ) {
    public_dir = path.join( public_dir, cfg.build_dir );
} else {
    public_dir = path.join( public_dir, cfg.compile_dir );
}
app.use( express.static( public_dir ) );

// Index.
app.get( '/', function ( req, res ) {
    res.redirect( public_dir + '/index.html' );
});

// 404.
app.get( '/*', function ( req, res ) {
    res.status( 404 );
    res.render( public_dir + '/#/404', 404 );
});

//TODO:serve favicon
//http://stackoverflow.com/questions/15463199/how-to-set-custom-favicon-in-node-js-express

// TODO:API
//require('./api/whatever')(app);

// Start the server.
var server = app.listen( port, function () {
    console.log( 'In %s mode. Listening on port %d.', environment, server.address().port );
});