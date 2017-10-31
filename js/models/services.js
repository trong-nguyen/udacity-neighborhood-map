'use strict';

/*
A collection of methods to retrieve model data
*/

var app = app || {};
    app.models = app.models || {};

(function (google, $) {
    var module = app.models;

    // This is Chicago
    var location = new google.maps.LatLng(41.8748819,-87.6514046);

    var map = new google.maps.Map(document.getElementById('google-map'), {
        center: location,
        zoom: 13
    });

    function getPlaces(interest) {
        // search for places by these parameters
        var request = {
            location: location,
            radius: 500,
            types: ['food'],
            keyword: interest,
            query: interest
        };

        var service = new google.maps.places.PlacesService(map);

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

    module.fetchData = function () {
        return new Promise(function (resolve, reject) {
            getPlaces('seafood')
                .then(function (results) {
                    module.getData = function () {
                        return results;
                    };
                    resolve(results);
                });
        });
    };

    module.getLocation = function () {
        return location;
    };

    module.getMap = function () {
        return map;
    };

    module.getFoursquare = function (latlng) {
        // if no credentials setup, return empty results
        if (!app.tauth || !app.tauth.foursquare) {
            return {};
        }

        var auth = app.tauth.foursquare;
        var url = "https://api.foursquare.com/v2/venues/search?";

        var params = $.param({
            ll            : String(latlng.lat) + "," + String(latlng.lng),
            client_id     : auth.client_id,
            client_secret : auth.client_secret,
            v             : auth.api_version
        });

        return new Promise (function (resolve, reject) {
            $.getJSON(url + params, resolve);
        });
    };

    module.getTweets = function (q, latlng) {
        var url = "https://api.trongn.com/twitter";
        var params = $.param({
            q       : q,
            geocode : [String(latlng.lat), String(latlng.lng), '5mi'].join(',')
        });

        // geocode=41.874882,-87.642227,5mi
        return new Promise (function (resolve, reject) {
            $.getJSON(url + '?' + params, function (results) {
                var tweets = results.statuses;
                resolve(tweets);
            });
        });
    };

})(google, $);