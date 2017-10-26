'use strict';

var app = app || {};

app.MainViewModel = function (argument) {
    self = this;
    this.places = [];
    this.placesData = {}; // for development
    this.searchForm = new app.viewModels.Search();
    this.map = new app.viewModels.Map(app.models);


    function doFiltering (text) {
        self.places.forEach(function (place) {
            if (text === "" || place.name.toLowerCase().includes(text.toLowerCase())) {
                place.visible(true);
            } else {
                place.visible(false);
            }
        });
    }

    this.searchForm.text.subscribe(doFiltering);

    this.init = function (placesArray) {
        // the raw returned array
        self.placesData = placesArray;

        placesArray.forEach(function (placeData) {
            self.places.push(new app.viewModels.Place(placeData));
        });

        // wire the visibility of the place on the list
        // to that of the marker on the map
        var markers = self.map.addMarkers(self.places);
        self.places.forEach(function (place, i) {
            place.visible.subscribe(function (isVisible) {
                markers[i].setMap(isVisible ? self.map.map : null);
            });
        });
    };
};

function main () {
    var viewModel = new app.MainViewModel();

    app.models.fetchData()
        .then(function (results) {
            viewModel.init(results);
            GX.app = viewModel;
            ko.applyBindings(viewModel);
        });
}

var GX = {};
$(document).ready(main);


// Delaying and/or suppressing change notifications
// app.searchBarView.extend({ rateLimit: 50 });
