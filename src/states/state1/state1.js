angular.module( 'app.state1', [
    'ui.router'
])

.config( function config ( $stateProvider ) {
    $stateProvider.state( 'state1', {
        url: '/state1',
        controller: 'State1Ctrl',
        templateUrl: 'states/state1/state1.tpl.html',
        data: {
            pageTitle: 'State 1'
        }
    } );
} )

.run( function run () {
} )

.controller( 'State1Ctrl', function State1Ctrl ( $scope ) {

    $scope.variable = 'VARIABLE_VALUE';
})

;