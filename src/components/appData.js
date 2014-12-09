angular.module( 'appData', [] )

.constant( 'API_URL', window.location.protocol + '//' + window.location.hostname + ( window.location.port ? ':' + window.location.port : '' ) + '/api/' )

//------------------------------------------------------------------------------
// APIService
//------------------------------------------------------------------------------
// Provides functions for interacting with the application's API.
.service( 'APIService', function( $http, API_URL ) {

    this.getUserInfo = function ( id ) {

        return $http.get( API_URL + 'user' + ( id ? '/' + id : '' ) );
    };
})

;