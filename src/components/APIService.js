angular.module( 'APIService', [] )

.config( function( $httpProvider ) {
    $httpProvider.interceptors.push( function ( $window ) {
        return {
            responseError: function ( response ) {
                if( response.status === 0 ) {
                    $window.location = $window.location.protocol + '//' + $window.location.hostname +
                        '/abounce/?endPoint=' + encodeURIComponent( '/app/' + $window.location.hash );
                }
            }
        };
    });
})

.constant( 'API_URL', window.location.protocol + '//' + window.location.hostname + '/api/' )

//------------------------------------------------------------------------------
// APIService
//------------------------------------------------------------------------------
// Provides functions for interacting with the application's API.
.service( 'APIService', function( $http, $q, $window, API_URL ) {

    // JSHint: Allow the use of reserved keywords (e.g. `delete`).
    /*jshint -W024 */

    //--------------------------------------------------------------------------
    // API Interaction
    //--------------------------------------------------------------------------

    // User
    //--------------------------------------------------------------------------

    this.getUserInfo = function ( id ) {

        return $http.get( API_URL + 'user' + ( id ? '/' + id : '' ) );
    };

    //--------------------------------------------------------------------------
    // Utility Functions
    //--------------------------------------------------------------------------

    //TODO
})

;