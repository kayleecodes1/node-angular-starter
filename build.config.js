module.exports = {

    bower_dir: 'bower_components',

    source_dir: 'src',
    build_dir: 'build',
    compile_dir: 'dist',

    vendor_files: {
        assets: [//TODO:use
            'bootstrap-css-only/fonts/**/*'
        ],
        css: [
            'bootstrap-css-only/css/bootstrap.min.css',
            'bootstrap-css-only/css/bootstrap-theme.min.css'
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
    },

    server_files: {
        //
    }
  
};
