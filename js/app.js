'use strict';

var app = app || {};

app.MainViewModel = function (data) {
    var self = this;

    this.places = data.map(function (placeData) {
        return new app.viewModels.Place(placeData);
    });
    this.searchForm = new app.viewModels.Search();
    this.map = new app.viewModels.Map();
    this.activePlace = ko.observable(null);

    var effects = {
        markers: []
    };



    function doFiltering (text) {
        self.places.forEach(function (place) {
            if (text === "" || place.name.toLowerCase().includes(text.toLowerCase())) {
                place.visible(true);
            } else {
                place.visible(false);

                if (place === self.activePlace()) {
                    self.activePlace(null);
                }
            }
        });
    }

    this.wireViews = function () {
        /*
        * @description: wire PlaceListView to GooglMapView in terms of
        * filtered places and current active place
        * @constructor
        * @param none
        */

        // wire the visibility of the place on the list
        // to that of the marker on the map
        var markers = self.map.createMarkers(self.places);
        self.places.forEach(function (place, i) {
            place.marker = markers[i];
            place.visible.subscribe(function (isVisible) {
                markers[i].setMap(isVisible ? self.map.getMap() : null);
            });
        });

        // wire Places to changes on SearchForm' filtering text
        self.searchForm.text.subscribe(doFiltering);

        // wire activePlace to Map's current info window
        self.activePlace.subscribe(function (place) {
            if (place !== null) {
                self.map.showInfoWindow(place);
                app.viewModels.animateMarker(place.marker);
            } else {
                self.map.hideInfoWindow();
            }
        });


        effects.markers = markers;
    };

    this.setActivePlace = function (place, event) {
        if (self.activePlace() !== place) {
            self.activePlace(place);
        }
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

    // prevent form submission - enter key code is 13
    $('#search-field').keypress(function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            return false;
        }
    });
}

var GX = {};
$(document).ready(main);


// Delaying and/or suppressing change notifications
// app.searchBarView.extend({ rateLimit: 50 });
