(function () {
    'use strict';

/*
*   @description: module that loads google maps asynchronously
*   @error handling loading google maps is implemented in app.js
*       in require.onError()
*/
define(['async!//maps.googleapis.com/maps/api/js?key=AIzaSyBzpVxGO1087J3Hm1hPSqtvsuY6sIlhZq0&libraries=places'],
    function () {
        return window.google;
});

})();