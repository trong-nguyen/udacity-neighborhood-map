'use strict';

var app = app || {};

/*
*   @description: the parent viewModel that manages other component viewModels
*       kind of a controller for viewModels
*/
app.MainViewModel = function (data) {
    var self = this;

    this.places = data.map(function (placeData) {
        return new app.viewModels.Place(placeData);
    });
    this.searchForm = new app.viewModels.Search();
    this.map = new app.viewModels.Map();
    this.activePlace = ko.observable(null);

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


    /*
    * @description: wire PlaceListView to GooglMapView in terms of
    * filtered places and current active place
    */
    this.wireViews = function () {

        // wire placeViewModel <--> mapViewModel
        // wire the visibility of the place on the list
        // to that of the marker on the map
        var markers = self.map.createMarkers(self.places);
        self.places.forEach(function (place, i) {
            place.marker = markers[i];
            place.visible.subscribe(function (isVisible) {
                markers[i].setMap(isVisible ? self.map.getMap() : null);
            });

            // bind mouse-click event on the map to setActivePlace
            place.marker.addListener('click', function (event) {
                self.setActivePlace(place);
            });
        });

        // wire searchViewModel <--> placeViewModel
        // wire Places to changes on SearchForm' filtering text
        self.searchForm.text.subscribe(doFiltering);

        // wire activePlace (and those dependent on it, such as placeViewModel) <--> mapViewModel and infoWindow
        self.activePlace.subscribe(function (place) {
            if (place !== null) {
                self.map.showInfoWindow(place);
                app.viewModels.animateMarker(place.marker);
            } else {
                self.map.hideInfoWindow();
            }
        });

        // Others visual / layout effects

        // wire menu visibility, which affects layout, to google map resize event
        // since google map does not redraw automatically on programmatic DOM changes
        $('#search-area').on('hidden.bs.collapse shown.bs.collapse', function (event) {
            self.map.redraw(self.places);
        });

        // force map redraw to accomodate place column size in init phase
        setTimeout(function () {
            self.map.redraw(self.places);
        }, 0);



        // prevent form submission - enter key code is 13
        $('#search-field').keypress(function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                return false;
            }
        });
    };

    /*
    *   Set the current viewed place, which then will be emphasized visually
    *   or further presented data (in infoWindow)
    *   activePlace serves as a common point for many viewModels to listen to
    */
    this.setActivePlace = function (place, event) {
        if (self.activePlace() !== place) {
            self.activePlace(place);
        }
    };


    // check if a place is active
    this.isActive = function (place) {
        return place == self.activePlace();
    };
};

function main () {

    // do initialization for utils, models (data)

    var loaded = Promise.all([
        app.utils.init(),
        app.models.init(),
        ]);

    // then instantiate viewModels, functional wiring and Knockout binding
    loaded.then(function (results) {
        var data = app.models.getData()
        var viewModel = new app.MainViewModel(data);
        viewModel.wireViews();
        GX.app = viewModel;
        ko.applyBindings(viewModel);
    }).catch(function (error) {
        console.log('Failed app initialization', error);
        alert('App initialization failed, refresh or try again later!')
    })
    ;
}

var GX = {};
$(document).ready(main);


// Delaying and/or suppressing change notifications
// app.searchBarView.extend({ rateLimit: 50 });
