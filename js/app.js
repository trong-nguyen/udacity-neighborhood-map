'use strict';

var app = app || {};

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

app.ViewModel = function (argument) {
    self = this;
    this.places = ko.observableArray();
    this.placesData = {};

    getPlaces()
        .then(function (results) {
            results.forEach(function (data) {
                self.places.push(new app.models.Place(data));
            });

            self.placesData = results;
        })
        .catch(function (why) {
            console.log('cannot get places', why);
        });
};

function main () {
    var viewModel = new app.ViewModel();
    GX.vm = viewModel;
}

var GX = {};
$(document).ready(main);


// Delaying and/or suppressing change notifications
// app.searchBarView.extend({ rateLimit: 50 });
