'use strict';

/*
A collection of methods to retrieve model data
*/

var app = app || {};
    app.models = app.models || {};

(function (module, google, $) {
    //  CONFIGURATIONS START ----------

    /*
    *   This section declares the pre-defined data for the app to run with.
    *   The purpose of pre-defined / hardcoded data is to narrow the scope of the project
    *   Make it work as required, extend later!
    */
    var location = new google.maps.LatLng(41.8748819,-87.6514046);// This is Chicago

    var _map = new google.maps.Map(document.getElementById('google-map'), {
        center: location,
        zoom: 13
    });

    var _data = []; //cached data

    // check it out at https://developers.google.com/places/supported_types
    var TYPES_OF_PLACES = ['food'];
    var PLACE_SEARCH_TERM = 'seafood';

    //  CONFIGURATIONS END----------

    /*
    *   @description: generic asynchronous load place data
    *       from Google Places API based on given interest
    *
    *   @params:
    *       - interest: the keyword used to search against places names
    */
    function getPlaces(interest) {
        var request = {
            location: location,
            radius: 500,
            types: TYPES_OF_PLACES,
            keyword: interest,
            query: interest
        };

        var service = new google.maps.places.PlacesService(_map);

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
    }

    /*
    *   @description: synchronous get of cached places data
    */
    module.getData = function () {
        return _data;
    };

    /*
    *   @description: asynchronous loading data with predefined interests
    *       invoked once when initializing App
    */
    module.fetchData = function () {

        if (!_data.length) {
            return new Promise (function (resolve, reject) {
                getPlaces(PLACE_SEARCH_TERM)
                    .then(function (results) {
                        _data = results; // caching
                        resolve(results)
                    })
                    .catch(reject);
            });
        }
    };

    // getting pre-defined location
    module.getLocation = function () {
        return location;
    };

    // getting map created from the pre-defined location
    module.getMap = function () {
        return _map;
    };

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
    module.getFoursquare = function (q, latlng) {

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
    };

    /*
    *   @description: Asynchronous loading places
    *       from Twitter database
    *   @params:
    *       q      : query term to search agaisnt names
    *       latlng : location in {lat: latValue, lng: lngValue} format
    */
    module.getTweets = function (q, latlng) {
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
    };

    /*
    *   @description: Asynchronous loading places
    *       from Yelp database
    *   @params:
    *       q      : query term to search agaisnt names
    *       latlng : location in {lat: latValue, lng: lngValue} format
    */
    module.getYelp = function (q, latlng) {
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
    };

    module.init = function () {
        return new Promise (function (resolve, reject) {
            app.models.fetchData()
                .then(resolve)
                .catch(reject)
                ;
        });
    };


})(app.models, google, $);