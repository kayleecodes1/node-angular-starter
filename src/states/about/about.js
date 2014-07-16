angular.module( 'app.about', [
    'ui.router'
])

.config( function config ( $stateProvider ) {
    $stateProvider.state( 'about', {
        url: '/about',
        controller: 'AboutCtrl',
        templateUrl: 'states/about/about.tpl.html',
        data: {
            pageTitle: 'About'
        }
    } );
} )

.run( function run () {
} )

.controller( 'AboutCtrl', function AboutCtrl ( $scope ) {
})

;