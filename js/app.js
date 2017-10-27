'use strict';

var app = app || {};

app.MainViewModel = function (data) {
    self = this;
    this.places = data.map(function (placeData) {
        return new app.viewModels.Place(placeData);
    });
    this.searchForm = new app.viewModels.Search();
    this.map = new app.viewModels.Map();


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

    this.wireViews = function () {
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

    var loaded = Promise.all([
        app.utils.init(),
        app.models.fetchData()
        ]);

    loaded.then(function (results) {
        var data = app.models.getData()
        var viewModel = new app.MainViewModel(data);
        viewModel.wireViews();
        GX.app = viewModel;
        ko.applyBindings(viewModel);
    });
}

var GX = {};
$(document).ready(main);


// Delaying and/or suppressing change notifications
// app.searchBarView.extend({ rateLimit: 50 });
