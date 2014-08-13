var gulp = require('gulp'),
    path = require('path'),
    merge = require('merge-stream'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    less = require('gulp-less'),
    rebaseUrls = require('gulp-css-rebase-urls'),
    urlAdjuster = require('gulp-css-url-adjuster'),
    minifyCSS = require('gulp-minify-css'),
    autoprefix = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    inject = require('gulp-inject'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngMin = require('gulp-ngmin'),
    html2js = require('gulp-html2js'),
    minifyHTML = require('gulp-minify-html'),
    gzip = require('gulp-gzip'),
    size = require('gulp-filesize'),
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

gulp.task('default', ['build','compile']);


//------------------------------------------------------------------------------
// BUILD
//------------------------------------------------------------------------------

gulp.task('build-clean', function () {
    return gulp.src(cfg.build_dir, {read: false}).pipe(clean());
});

gulp.task('build-vendor', function () {
    
    var bowerAssets = gulp.src(cfg.vendor_files.assets, {cwd: cfg.vendor_dir + '/**'});
    var bowerCSS = gulp.src(cfg.vendor_files.css, {cwd: cfg.vendor_dir + '/**'});
    var bowerJS = gulp.src(cfg.vendor_files.js, {cwd: cfg.vendor_dir + '/**'});

    return merge( bowerAssets, bowerCSS, bowerJS )
        .pipe(gulp.dest(cfg.build_dir + '/vendor'));
});

gulp.task('build-assets', function () {

    return gulp.src(cfg.source_files.assets)
        .pipe(changed(cfg.build_dir + '/assets'))
        .pipe(gulp.dest(cfg.build_dir + '/assets'));
});

gulp.task('build-css', function () {

    return gulp.src( cfg.source_files.less.all )
        //.pipe(changed(cfg.build_dir))
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join( __dirname, 'less', 'includes' ) ]
        }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(concat(pkg.name + '-' + pkg.version + '.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cfg.build_dir));
});

gulp.task('build-templates', function () {

    gulp.src( cfg.source_files.html.tpl )
        .pipe(html2js({
            base: 'src',
            outputModuleName: 'appTemplates'
        }))
        .pipe( concat(pkg.name + '-' + pkg.version + '-templates.js') )
        .pipe( gulp.dest( cfg.build_dir ) );
});

gulp.task('build-lint', function () {

    return gulp.src( cfg.source_files.js.all )
        .pipe(changed(cfg.build_dir))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build-js', ['build-lint'], function () {

    return gulp.src( cfg.source_files.js.all )
        .pipe(changed(cfg.build_dir))
        .pipe(gulp.dest(cfg.build_dir));
});

gulp.task('build-index', function () {

    var vendorCSS = gulp.src( cfg.vendor_files.css, {cwd: path.join(__dirname, cfg.build_dir, 'vendor'), read: false} );
    var vendorJS = gulp.src( cfg.vendor_files.js, {cwd: path.join(__dirname, cfg.build_dir, 'vendor'), read: false} );
    var appCSS = gulp.src([cfg.build_dir + '/**/*.css', '!' + cfg.build_dir + '/vendor/**/*'], {read: false});
    var appJS = gulp.src([cfg.build_dir + '/**/*.js', '!' + cfg.build_dir + '/vendor/**/*'], {read: false});

    return gulp.src( cfg.source_files.html.index )
        .pipe( inject( merge( vendorCSS, vendorJS ), { addPrefix: 'vendor', addRootSlash: false, starttag: '<!-- inject:vendor:{{ext}} -->' } ))
        .pipe( inject( merge( appCSS, appJS ), { ignorePath: cfg.build_dir, addRootSlash: false } ))
        .pipe(gulp.dest(cfg.build_dir));
});

gulp.task('build', function ( cb ) {
    runSequence(
        'build-clean',
        ['build-vendor', 'build-assets', 'build-css', 'build-templates', 'build-js'],
        'build-index',
        cb
    );
});


//------------------------------------------------------------------------------
// WATCH
//------------------------------------------------------------------------------

gulp.task('watch', ['build'], function () {

    livereload.listen();
    
    gulp.watch(cfg.source_files.assets, ['build-assets'])
    .on('change', function ( event ) {
        if( event.type === 'renamed' || event.type === 'deleted' ) {
            var pathParts = (event.old || event.path).split(path.sep);
            var deletePath = pathParts.slice(pathParts.indexOf('src') + 1).join(path.sep);
            gulp.src(deletePath, {cwd: cfg.build_dir}).pipe(clean());
        }
    });
    gulp.watch(cfg.source_files.less.all, ['build-css']);
    gulp.watch(cfg.source_files.html.tpl, ['build-templates']);
    gulp.watch(cfg.source_files.js.all, [])
    .on('change', function ( event ) {
        if( event.type === 'added' || event.type === 'renamed' || event.type === 'deleted' ) {
            if( event.type === 'renamed' || event.type === 'deleted' ) {
                var pathParts = (event.old || event.path).split(path.sep);
                var deletePath = pathParts.slice(pathParts.indexOf('src') + 1).join(path.sep);
                gulp.src(deletePath, {cwd: cfg.build_dir}).pipe(clean());
            }
            runSequence( 'build-js', 'build-index', function(){} );
        } else {
            runSequence( 'build-js', function(){} );
        }
    });
    gulp.watch(cfg.source_files.html.index, ['build-index']);

    gulp.watch(cfg.build_dir + '/**/*', livereload.changed);
});


//------------------------------------------------------------------------------
// SERVE
//------------------------------------------------------------------------------

gulp.task('serve', ['watch'], function () {
    nodemon({
        script: 'server/server.js',
        watch: 'server/',
        ext: 'js json'
    }).on('start', function () {
        setTimeout( function () {
            livereload.changed();
        }, 2000);
    });
});


//------------------------------------------------------------------------------
// COMPILE
//------------------------------------------------------------------------------

// Clear the compile directory.
gulp.task('compile-clean', function () {
    return gulp.src(cfg.compile_dir, {read: false}).pipe(clean());
});

gulp.task('compile-assets', function () {

    var bowerAssets = gulp.src(cfg.vendor_files.assets, {cwd: cfg.vendor_dir + '/**'});

    var appAssets = gulp.src(cfg.source_files.assets)
        .pipe( imagemin( {
            progressive: true,
            svgoPlugins: [ { removeViewBox: false } ],
            use: [ pngcrush() ]
        }));

    return merge( bowerAssets, appAssets )
        .pipe(size())
        .pipe(gulp.dest(cfg.compile_dir + '/assets'));
});

gulp.task('compile-css', function () {

    var bowerCSS = gulp.src(cfg.vendor_files.css, {cwd: cfg.vendor_dir})
        .pipe(rebaseUrls())
        .pipe(urlAdjuster({prepend: 'assets/'}));

    var appCSS = gulp.src( cfg.source_files.less.all ) 
        .pipe(less({
            paths: [ path.join( __dirname, 'less', 'includes' ) ]
        }))
        .pipe(autoprefix('last 2 versions'));

    return merge( bowerCSS, appCSS )
        .pipe(concat(pkg.name + '-' + pkg.version + '.min.css'))
        .pipe(minifyCSS({ keepSpecialComments: 0 }))
        .pipe(gzip({ append: false }))
        .pipe(size())
        .pipe(gulp.dest(cfg.compile_dir));

});

gulp.task('compile-lint', function () {
    
    return gulp.src( cfg.source_files.js.all )
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('compile-js', ['compile-lint'], function () {

    var bowerJS = gulp.src(cfg.vendor_files.js, {cwd: cfg.vendor_dir});

    var templateJS = gulp.src( cfg.source_files.html.tpl )
        .pipe(minifyHTML({empty: true}))
        .pipe(html2js({
            base: 'src',
            outputModuleName: 'appTemplates'
        }));

    var appJS = gulp.src( cfg.source_files.js.all )
        .pipe(ngMin());

    return merge( bowerJS, templateJS, appJS )
        .pipe(concat(pkg.name + '-' + pkg.version + '.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gzip({ append: false }))
        .pipe(size())
        .pipe(gulp.dest(cfg.compile_dir));
});

gulp.task('compile-index', function () {
    return gulp.src(cfg.source_files.html.index)
        .pipe(inject(
            gulp.src(cfg.compile_dir + '/**/*.{css,js}', {read: false}),
            {
                addRootSlash: false,
                ignorePath: cfg.compile_dir
            }
        ))
        .pipe(minifyHTML({empty: true}))
        .pipe(gulp.dest(cfg.compile_dir));
});

gulp.task('compile', function ( cb ) {
    runSequence(
        'compile-clean',
        ['compile-assets', 'compile-css', 'compile-js'],
        ['compile-index'],
        cb
    );
});