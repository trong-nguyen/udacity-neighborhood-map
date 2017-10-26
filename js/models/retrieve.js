'use strict';

/*
A collection of methods to retrieve model data
*/

var app = app || {};
    app.models = app.models || {};

(function (google) {
    function getPlaces(interest) {
        var chicago = new google.maps.LatLng(41.8333925,-88.0121478);

        var map = new google.maps.Map(document.getElementById('google-map'), {
            center: chicago,
            zoom: 15
        });

        // search for places by these parameters
        var request = {
            location: chicago,
            radius: 500,
            types: ['food'],
            name: 'italian restaurant'
        }

        var service = new google.maps.places.PlacesService(map);

        return new Promise (function (resolve, reject) {
            service.nearbySearch(request, function (results, status) {
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
            getPlaces()
                .then(function (results) {
                    resolve(results);
                })
                .catch(function (why) {
                    console.log('cannot get places', why);
                    reject();
                });
        });
    }
})(google);