'use strict';

/*
A collection of methods to retrieve model data
*/

var app = app || {};
    app.models = app.models || {};

(function (google) {
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

    app.models.fetchData = function () {
        return new Promise(function (resolve, reject) {
            getPlaces('seafood')
                .then(resolve)
                .catch(function (why) {
                    console.log('cannot get places', why);
                    reject();
                });
        });
    };

    app.models.getLocation = function () {
        return location;
    };

    app.models.getMap = function () {
        return map;
    };

})(google);