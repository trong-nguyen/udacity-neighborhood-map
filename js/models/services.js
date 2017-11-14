'use strict';

/*
A collection of methods to retrieve model data
*/

define(function (require) {
    var
        google = require('google'),
        $      = require('jquery');

    return {
        /*
        *   @description: generic asynchronous load place data
        *       from Google Places API based on given interest
        *
        *   @params:
        *       - request: the object that contains request details
        *       ex:
        *       {
        *          location : { lat: 41.8748819, lng: -87.6514046 },
        *          types    : ['food'],
        *          keyword  : 'seafood',
        *          query    : 'seafood',
        *          radius   : 500
        *       };
        */
        getPlaces: function(request) {
            var service = new google.maps.places.PlacesService($('<div>').get(0));

            return new Promise (function (resolve, reject) {
                // service.nearbySearch(request, function (results, status) {
                service.textSearch(request, function (results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results);
                    } else {
                        reject(status);
                    }
                });
            });
        },

        /*
        *   The below functions fetch data asynchronously from different APIs
        *   proxied through a prebuilt backend, where tracking or Auth details
        *   were added to make up for lack of proper backend operations avoid
        *   unecessary exposing secrets.
        */

        /*
        *   @description: Asynchronous loading places
        *       from Foursquare database
        *   @params:
        *       q      : query term to search agaisnt names
        *       latlng : location in {lat: latValue, lng: lngValue} format
        */
        getFoursquare: function (q, latlng) {

            var url = "https://api.trongn.com/public/foursquare";
            var version = '20170801';

            var params = $.param({
                query : q,
                ll    : String(latlng.lat) + "," + String(latlng.lng),
                v     : version,
                limit : 1
            });

            return new Promise (function (resolve, reject) {
                $.getJSON(url + '?' + params, function (results) {
                    resolve(results.response.venues);
                })
                .fail(function (e) {
                    console.log('Error calling Foursquare API', e);
                    reject(e);
                });
            });
        },

        /*
        *   @description: Asynchronous loading places
        *       from Twitter database
        *   @params:
        *       q      : query term to search agaisnt names
        *       latlng : location in {lat: latValue, lng: lngValue} format
        */
        getTweets: function (q, latlng) {
            var url = "https://api.trongn.com/public/twitter";
            var params = $.param({
                q       : q,
                geocode : [String(latlng.lat), String(latlng.lng), '5mi'].join(','),
                count   : 5,
            });

            return new Promise (function (resolve, reject) {
                $.getJSON(url + '?' + params, function (results) {
                    var tweets = results.statuses;
                    resolve(tweets);
                })
                .fail(function (e) {
                    console.log('Error calling Twitter API', e);
                    reject(e);
                });
            });
        },

        /*
        *   @description: Asynchronous loading places
        *       from Yelp database
        *   @params:
        *       q      : query term to search agaisnt names
        *       latlng : location in {lat: latValue, lng: lngValue} format
        */
        getYelp: function (q, latlng) {
            var url = "https://api.trongn.com/public/yelp";
            var params = $.param({
                term      : q,
                latitude  : latlng.lat,
                longitude : latlng.lng,
                limit     : 1,
            });

            return new Promise (function (resolve, reject) {
                $.getJSON(url + '?' + params, function (results) {
                    var businesses = results.businesses;
                    resolve(businesses);
                })
                .fail(function (e) {
                    console.log('Error calling Yelp API', e);
                    reject(e);
                });
            });
        },
    };
});