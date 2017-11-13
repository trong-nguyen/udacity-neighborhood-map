'use strict';

/*
*   @descriptions
*   This section declares the pre-defined data for the app to run with.
*   The purpose of pre-defined / hardcoded data is to narrow the scope of the project
*   Make it work as required, extend later!
*/
define(function (require) {
    return {
        place: {
            location : { lat: 41.8748819, lng: -87.6514046 },
            types    : ['food'],
            keyword  : 'seafood',
            query    : 'seafood',
            radius   : 500,
        }
    }
});