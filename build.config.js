module.exports = {

    vendor_dir: 'vendor',
    vendor_files: {
        assets: [
            'bootstrap-css-only/fonts/**/*',
            'components-font-awesome/fonts/**/*'
        ],
        css: [
            'bootstrap-css-only/css/bootstrap.css',
            'bootstrap-css-only/css/bootstrap-theme.css',
            'components-font-awesome/css/font-awesome.css'
        ],
        js: [
            'angular/angular.js',
            'angular-ui-router/release/angular-ui-router.js',
            'angular-bootstrap/ui-bootstrap-tpls.js'
        ]
    },

    source_files: {
        html: {
            index: 'src/index.html',
            tpl: 'src/**/*.tpl.html'
        },
        assets: 'src/assets/**/*',
        less: {
            entry: 'src/app.less',
            all: 'src/**/*.less'
        },
        js: {
            all: 'src/**/*.js'
        }
    },

    build_dir: 'build',
    compile_dir: 'dist'
};
