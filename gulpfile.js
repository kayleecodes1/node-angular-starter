var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    streamqueue = require('streamqueue'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    less = require('gulp-less'),
    rebaseUrls = require('gulp-css-rebase-urls'),
    urlAdjuster = require('gulp-css-url-adjuster'),
    minifyCSS = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    html2js = require('gulp-html2js'),
    minifyHTML = require('gulp-minify-html'),
    gzip = require('gulp-gzip'),
    size = require('gulp-size'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    changed = require('gulp-changed'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

var pkg = require('./package.json'),
    cfg = require('./build.config.js');


//------------------------------------------------------------------------------
// DEFAULT
//------------------------------------------------------------------------------

gulp.task( 'default', [ 'compile' ] );


//------------------------------------------------------------------------------
// BUILD
//------------------------------------------------------------------------------

gulp.task( 'build-clean', function () {

    return gulp.src( cfg.build_dir, { read: false } )
        .pipe( clean() );
});

gulp.task( 'build-vendor', function () {
    
    var bowerAssets = gulp.src( cfg.vendor_files.assets, { cwd: cfg.vendor_dir + '/**' } );
    var bowerCSS = gulp.src( cfg.vendor_files.css, { cwd: cfg.vendor_dir + '/**' } );
    var bowerJS = gulp.src( cfg.vendor_files.js, { cwd: cfg.vendor_dir + '/**' } );

    return streamqueue( { objectMode: true }, bowerAssets, bowerCSS, bowerJS )
        .pipe( gulp.dest( cfg.build_dir + '/vendor' ) );
});

gulp.task( 'build-assets', function () {

    var appAssets = gulp.src( cfg.source_files.assets )
        .pipe( changed( cfg.build_dir + '/assets' ) )
        .pipe( gulp.dest( cfg.build_dir + '/assets' ) );

    return appAssets;
});

gulp.task( 'build-css', function () {

    var appCSS = gulp.src( cfg.source_files.less.all )
        //.pipe(changed(cfg.build_dir))
        .pipe( less({
            paths: [ path.join( __dirname, 'less', 'includes' ) ]
        }))
        .on( 'error', function ( err ) {
            gutil.log( err.message );
            appCSS.end();
        })
        .pipe( autoprefix( 'last 2 versions' ) )
        .pipe( concat( pkg.name + '-' + pkg.version + '.css' ) )
        .pipe( gulp.dest( cfg.build_dir ) );

    return appCSS;
});

gulp.task( 'build-templates', function () {

    var appTemplates = gulp.src( cfg.source_files.html.tpl )
        .pipe( html2js({
            base: 'src',
            outputModuleName: 'appTemplates'
        }))
        .pipe( concat( pkg.name + '-' + pkg.version + '-templates.js' ) )
        .pipe( gulp.dest( cfg.build_dir ) );

    return appTemplates;
});

gulp.task( 'build-lint', function () {

    var appLint = gulp.src( cfg.source_files.js.all )
        .pipe( changed( cfg.build_dir ) )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) );

    return appLint;
});

gulp.task( 'build-js', [ 'build-lint' ], function () {

    var appJS = gulp.src( cfg.source_files.js.all )
        .pipe( changed( cfg.build_dir ) )
        .pipe( gulp.dest( cfg.build_dir ) );

    return appJS;
});

gulp.task( 'build-index', function () {

    var vendorCSS = gulp.src( cfg.vendor_files.css, { cwd: path.join( __dirname, cfg.build_dir, 'vendor' ), read: false } );
    var vendorJS = gulp.src( cfg.vendor_files.js, { cwd: path.join( __dirname, cfg.build_dir, 'vendor' ), read: false } );
    var appCSS = gulp.src( [ cfg.build_dir + '/**/*.css', '!' + cfg.build_dir + '/vendor/**/*' ], { read: false } );
    var appJS = gulp.src( [ cfg.build_dir + '/**/*.js', '!' + cfg.build_dir + '/vendor/**/*' ], { read: false } );

    return gulp.src( cfg.source_files.html.index )
        .pipe( inject( streamqueue( { objectMode: true }, vendorCSS, vendorJS ), { addPrefix: 'vendor', addRootSlash: false, starttag: '<!-- inject:vendor:{{ext}} -->' } ) )
        .pipe( inject( streamqueue( { objectMode: true }, appCSS, appJS ), { ignorePath: cfg.build_dir, addRootSlash: false, starttag: '<!-- inject:app:{{ext}} -->' } ) )
        .pipe( gulp.dest( cfg.build_dir ) );
});

gulp.task( 'build', function ( cb ) {
    runSequence(
        'build-clean',
        [ 'build-vendor', 'build-assets', 'build-css', 'build-templates', 'build-js' ],
        'build-index',
        cb
    );
});


//------------------------------------------------------------------------------
// WATCH
//------------------------------------------------------------------------------

gulp.task( 'watch', [ 'build' ], function () {

    livereload.listen();
    
    gulp.watch( cfg.source_files.assets, [ 'build-assets' ] )
    .on( 'change', function ( event ) {
        if( event.type === 'renamed' || event.type === 'deleted' ) {
            var pathParts = ( event.old || event.path ).split( path.sep );
            var deletePath = pathParts.slice( pathParts.indexOf( 'src' ) + 1 ).join( path.sep );
            gulp.src( deletePath, { cwd: cfg.build_dir } ).pipe( clean() );
        }
    });
    gulp.watch( cfg.source_files.less.all, [ 'build-css' ] );
    gulp.watch( cfg.source_files.html.tpl, [ 'build-templates' ] );
    gulp.watch( cfg.source_files.js.all, [] )
    .on( 'change', function ( event ) {
        if( event.type === 'added' || event.type === 'renamed' || event.type === 'deleted' ) {
            if( event.type === 'renamed' || event.type === 'deleted' ) {
                var pathParts = ( event.old || event.path ).split( path.sep );
                var deletePath = pathParts.slice( pathParts.indexOf( 'src' ) + 1 ).join( path.sep );
                gulp.src( deletePath, { cwd: cfg.build_dir } ).pipe( clean() );
            }
            runSequence( 'build-js', 'build-index', function () {} );
        } else {
            runSequence( 'build-js', function () {} );
        }
    });
    gulp.watch( cfg.source_files.html.index, [ 'build-index' ] );

    gulp.watch( cfg.build_dir + '/**/*', livereload.changed );

    console.log( 'Watching for changes to application files...' );
});


//------------------------------------------------------------------------------
// SERVE
//------------------------------------------------------------------------------

gulp.task( 'server-lint', function () {

    var serverLint = gulp.src( 'server/**/*.{js}' )
        .pipe( changed( 'server' ) )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) );

    return serverLint;
});

gulp.task( 'serve', [ 'watch', 'server-lint' ], function () {

    return nodemon({
        script: 'server/index.js',
        env: { 'npm_config_dev': true, 'npm_config_port': pkg.config.defaultPort },
        watch: 'server/',
        ext: 'js json',
        //stdout: false,
        //stderr: false,
        //verbose: false
    })
    //.on( 'readable', function () {} )
    .on( 'start', function () {
        console.log( 'Watching for changes to server files...' );
    })
    .on( 'change', [ 'server-lint' ] )
    .on( 'restart', function () {
        console.log( 'Changes to server files detected. Restarting server.' );
        setTimeout( function () {
            livereload.changed();
        }, 2000 );
    });
});


//------------------------------------------------------------------------------
// COMPILE
//------------------------------------------------------------------------------

// Clear the compile directory.
gulp.task( 'compile-clean', function () {
    
    return gulp.src( cfg.compile_dir, { read: false } )
        .pipe( clean() );
});

gulp.task( 'compile-assets', function () {

    var bowerAssets = gulp.src( cfg.vendor_files.assets, { cwd: cfg.vendor_dir + '/**' } );

    var appAssets = gulp.src( cfg.source_files.assets )
        .pipe( imagemin({
            progressive: true,
            svgoPlugins: [ { removeViewBox: false } ],
            use: [ pngcrush() ]
        }));

    return streamqueue( { objectMode: true }, bowerAssets, appAssets )
        .pipe( size( { title: 'Compiled Assets' } ) )
        .pipe( gulp.dest( cfg.compile_dir + '/assets' ) );
});

gulp.task( 'compile-css', function () {

    var bowerCSS = gulp.src( cfg.vendor_files.css, { cwd: cfg.vendor_dir } )
        .pipe( rebaseUrls() )
        .pipe( urlAdjuster( { prepend: 'assets/' } ) );

    var appCSS = gulp.src( cfg.source_files.less.all ) 
        .pipe( less({
            paths: [ path.join( __dirname, 'less', 'includes' ) ]
        }))
        .on( 'error', function ( err ) {
            gutil.log( err.message );
            appCSS.end();
        })
        .pipe( autoprefix( 'last 2 versions' ) );

    return streamqueue( { objectMode: true }, bowerCSS, appCSS )
        .pipe( concat( pkg.name + '-' + pkg.version + '.min.css' ) )
        .pipe( minifyCSS( { keepSpecialComments: 0 } ) )
        .pipe( gulp.dest( cfg.compile_dir ) )
        .pipe( size( { title: 'Compiled CSS' } ) )
        .pipe( gzip( { append: true } ) )
        .pipe( size( { title: 'Compiled CSS (gzipped)' } ) )
        .pipe( gulp.dest( cfg.compile_dir ) );

});

gulp.task( 'compile-lint', function () {
    
    var appLint = gulp.src( cfg.source_files.js.all )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) );

    return appLint;
});

gulp.task( 'compile-js', [ 'compile-lint' ], function () {

    var bowerJS = gulp.src( cfg.vendor_files.js, { cwd: cfg.vendor_dir } );

    var templateJS = gulp.src( cfg.source_files.html.tpl )
        .pipe( minifyHTML( { empty: true } ) )
        .pipe( html2js({
            base: 'src',
            outputModuleName: 'appTemplates'
        }));

    var appJS = gulp.src( cfg.source_files.js.all )
        .pipe( ngAnnotate() );

    return streamqueue( { objectMode: true }, bowerJS, templateJS, appJS )
        .pipe( concat( pkg.name + '-' + pkg.version + '.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( cfg.compile_dir ) )
        .pipe( size( { title: 'Compiled JS' } ) )
        .pipe( gzip( { append: true } ) )
        .pipe( size( { title: 'Compiled JS (gzipped)' } ) )
        .pipe( gulp.dest( cfg.compile_dir ) );
});

gulp.task( 'compile-index', function () {

    var appIndex = gulp.src( cfg.source_files.html.index )
        .pipe( inject(
            gulp.src( cfg.compile_dir + '/**/*.{css,js}', { read: false } ),
            {
                addRootSlash: false,
                ignorePath: cfg.compile_dir,
                starttag: '<!-- inject:app:{{ext}} -->'
            }
        ))
        .pipe( minifyHTML( { empty: true } ) )
        .pipe( gulp.dest( cfg.compile_dir ) )
        .pipe( gzip( { append: true } ) )
        .pipe( gulp.dest( cfg.compile_dir ) );

    return appIndex;
});

gulp.task( 'compile', function ( cb ) {
    runSequence(
        'compile-clean',
        [ 'compile-assets', 'compile-css', 'compile-js' ],
        [ 'compile-index' ],
        cb
    );
});