var express = require('express');

var app = express(),
    port = parseInt( process.env.PORT, 10 ) || 3000,
    isDev = true;

var cfg = require('../build.config.js');

var public_dir = __dirname + '/../';
if( isDev ) {
    public_dir += cfg.build_dir;
} else {
    public_dir += cfg.compile_dir;
}
app.use( express.static( public_dir ) );

app.get( '/', function ( req, res ) {
    res.redirect( public_dir + '/index.html' );
});
//TODO:serve favicon
//http://stackoverflow.com/questions/15463199/how-to-set-custom-favicon-in-node-js-express

// TODO:API
//require('./api/bus')(app);

// Start the server.
var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});