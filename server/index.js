var path = require('path'),
    cluster = require('cluster'),
    express = require('express'),
    ecstatic = require('ecstatic'),
    favicon = require('serve-favicon');

var cfg = require('../build.config.js');

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

// Start server with cluster
if(cluster.isMaster){

    console.log('App Master Process ID is %d',process.pid);
    process.title = process.env.npm_package_config_processName + '_Master';
    var cpuCount = require('os').cpus().length;


    // Setup some cluster handlers to handle worker events
    cluster.on('listening', function(worker, address) {
        //console.log("Worker %d is now connected.", worker.id);
    });

    cluster.on('online', function(worker) {
        console.log("Worker %d is now online.",worker.id);
    });

    cluster.on('disconnect', function(worker){
        console.log("Worker %d disconnected", worker.id);
        cluster.fork();
    });

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
}else{

    process.title = process.env.npm_package_config_processName + '_Worker';
    // Start the server.
    var server = app.listen( port, function () {
        console.log( 'In %s mode. Listening on port %d with worker ID %d.', environment, server.address().port, cluster.worker.id);
    });

}

