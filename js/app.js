'use strict';

var app = app || {};

app.MainViewModel = function (argument) {
    self = this;
    this.places = ko.observableArray();
    this.placesData = {};
    this.searchForm = new app.viewModels.Search();


    function doFiltering (text) {
        self.places().forEach(function (place) {
            if (text === "" || place.name().toLowerCase().includes(text.toLowerCase())) {
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
    };
};

function main () {
    var viewModel = new app.MainViewModel();

    app.models.fetchData()
        .then(function (results) {
            viewModel.init(results);
            GX.vm = viewModel;
            ko.applyBindings(viewModel);
        });
}

var GX = {};
$(document).ready(main);


// Delaying and/or suppressing change notifications
// app.searchBarView.extend({ rateLimit: 50 });
