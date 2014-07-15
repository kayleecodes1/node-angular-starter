var gulp = require('gulp'),
    path = require('path'),
    es = require('event-stream'),
    filter = require('gulp-filter'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
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
    runSequence = require('run-sequence'),
    changed = require('gulp-changed'),
    livereload = require('gulp-livereload');

var pkg = require('./package.json'),
    cfg = require('./build.config.js');


//------------------------------------------------------------------------------
// DEFAULT
//------------------------------------------------------------------------------

gulp.task('default', ['compile']);


//------------------------------------------------------------------------------
// BUILD
//------------------------------------------------------------------------------

gulp.task('build-clean', function () {
    return gulp.src(cfg.build_dir, {read: false}).pipe(clean());
});

gulp.task('build-vendor', function () {
    
    var bowerAssets = gulp.src(cfg.vendor_files.assets, {cwd: cfg.bower_dir + '/**'});
    var bowerCSS = gulp.src(cfg.vendor_files.css, {cwd: cfg.bower_dir + '/**'});
    var bowerJS = gulp.src(cfg.vendor_files.js, {cwd: cfg.bower_dir + '/**'});

    return es.merge( bowerAssets, bowerCSS, bowerJS )
        .pipe(gulp.dest(cfg.build_dir + '/vendor'));
});

gulp.task('build-assets', function () {

    return gulp.src(cfg.source_files.assets)
        .pipe(changed(cfg.build_dir + '/assets'))
        .pipe(gulp.dest(cfg.build_dir + '/assets'));
});

gulp.task('build-css', function () {

    return gulp.src( cfg.source_files.less.all )
        .pipe(changed(cfg.build_dir))
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [ path.join( __dirname, 'less', 'includes' ) ]
        }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cfg.build_dir));
});

gulp.task('build-templates', function () {

    //TODO
    gulp.src( cfg.source_files.html.tpl )
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

gulp.task('build-index', /*['build-vendor', 'build-css', 'build-js', 'build-templates'], */function () {
    
    var vendorCSS = gulp.src( cfg.vendor_files.css, {cwd: cfg.build_dir + '/vendor', read: false} );
    var appCSS = gulp.src([cfg.build_dir + '/**/*.css', '!' + cfg.build_dir + '/vendor/**/*'], {read: false});
    var vendorJS = gulp.src( cfg.vendor_files.js, {cwd: cfg.build_dir + '/vendor', read: false} );
    var appJS = gulp.src([cfg.build_dir + '/**/*.js', '!' + cfg.build_dir + '/vendor/**/*'], {read: false});

    var options = { addRootSlash: false, ignorePath: 'build' };
    return gulp.src( cfg.source_files.html.index )
        .pipe( inject( es.merge( vendorCSS, appCSS, vendorJS, appJS ), options ))
        .pipe(gulp.dest(cfg.build_dir));
});

//TODO: this needs to CHANGE
// DEPENDENCIES need to be removed so WATCH will work
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

    /*gulp.watch(cfg.source_files.html.index, ['index']);
    gulp.watch(cfg.source_files.html.tpl, ['js']);
    gulp.watch(cfg.source_files.assets, ['assets']);
    gulp.watch(cfg.source_files.less.all, ['css']);
    gulp.watch(cfg.source_files.js.all, ['js']);*/

    gulp.watch(cfg.build_dir + '/**', livereload.changed);
});


//------------------------------------------------------------------------------
// COMPILE
//------------------------------------------------------------------------------

// Clear the compile directory.
gulp.task('compile-clean', function () {
    return gulp.src(cfg.compile_dir, {read: false}).pipe(clean());
});

gulp.task('assets', function () {

    var bowerAssets = gulp.src(cfg.vendor_files.assets, {cwd: cfg.bower_dir + '/**'});

    var appAssets = gulp.src(cfg.source_files.assets);

    return es.merge( bowerAssets, appAssets )
        .pipe(gulp.dest(cfg.compile_dir + '/assets'));
});

gulp.task('css', function () {

    var bowerCSS = gulp.src(cfg.vendor_files.css, {cwd: cfg.bower_dir})
        .pipe(rebaseUrls())
        .pipe(urlAdjuster({prepend: 'assets/'}));

    var appCSS = gulp.src( cfg.source_files.less.all ) 
        .pipe(less({
            paths: [ path.join( __dirname, 'less', 'includes' ) ]
        }))
        .pipe(autoprefix('last 2 versions'));

    return es.merge( bowerCSS, appCSS )
        .pipe(concat(pkg.name + '-' + pkg.version + '.min.css'))
        .pipe(minifyCSS({ keepSpecialComments: 0 }))
        .pipe(gulp.dest(cfg.compile_dir));

});

gulp.task('lint', function () {
    
    return gulp.src( cfg.source_files.js.all )
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('js', ['lint'], function () {

    var bowerJS = gulp.src(cfg.vendor_files.js, {cwd: cfg.bower_dir});

    var templateJS = gulp.src( cfg.source_files.html.tpl )
        .pipe(minifyHTML({empty: true}))
        .pipe(html2js({
            base: 'src',
            outputModuleName: 'appTemplates'
        }));

    var appJS = gulp.src( cfg.source_files.js.all )
        .pipe(ngMin());

    return es.merge( bowerJS, templateJS, appJS )
        .pipe(concat(pkg.name + '-' + pkg.version + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(cfg.compile_dir));
});

gulp.task('index', ['css', 'js'], function () {
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
    runSequence( 'compile-clean', ['assets', 'index'], cb );
});