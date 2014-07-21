module.exports = {

    build_dir: 'build',
    compile_dir: 'dist',

    vendor_dir: 'vendor',
    vendor_files: {
        assets: [
            'bootstrap-css-only/fonts/**/*',
            'components-font-awesome/fonts/**/*'
        ],
        css: [
            'bootstrap-css-only/css/bootstrap.min.css',
            'bootstrap-css-only/css/bootstrap-theme.min.css',
            'components-font-awesome/css/font-awesome.min.css'
        ],
        js: [
            'angular/angular.min.js',
            'angular-ui-router/release/angular-ui-router.min.js',
            'angular-bootstrap/ui-bootstrap-tpls.min.js'
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
    }
};
