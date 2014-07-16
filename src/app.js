angular.module( 'app', [
    'ui.router',
    'ui.bootstrap',
    'appTemplates',
    'app.about',
    'APIService'
])

.constant( 'APP_TITLE', 'Node Angular Starter' )

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
     $stateProvider.state( 'index', {
        url: '/',
        data: {
            pageTitle: 'Home'
        }
    } );
    $urlRouterProvider.otherwise( '/' );
})

.run( function run ( $rootScope, APP_TITLE ) {
    $rootScope.APP_TITLE = APP_TITLE;
})

.controller( 'AppCtrl', function AppCtrl ( $scope, APP_TITLE ) {

    $scope.loggedIn = true;
    $scope.username = 'username';

    // Update the page title according the current state data.
    $scope.$on( '$stateChangeSuccess', function( event, toState ) {
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle + ' | ' + APP_TITLE;
        }
    });
})

;