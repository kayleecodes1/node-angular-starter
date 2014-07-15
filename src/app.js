angular.module( 'app', [
    'ui.router',
    'appTemplates',
    'app.state1'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
     $stateProvider.state( 'index', {
        url: '/',
        data: {
            pageTitle: 'App Index'
        }
    } );
    $urlRouterProvider.otherwise( '' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope ) {

    // Update the page title according the current state data.
    $scope.$on( '$stateChangeSuccess', function( event, toState ) {
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle;
        }
    });
})

;