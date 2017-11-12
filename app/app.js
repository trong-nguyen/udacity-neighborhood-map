'use strict';

function errorLoadingLibrary(lib) {
    console.error('Error loading library', lib, ', try again later!');
}


/*
*   @description: the parent viewModel that manages other component viewModels
*       kind of a controller for viewModels. The mainViewModel is a singleton
*       since by design only one mainViewModel is required for an app.
*/
define(function (require) {
    var ko              = require('knockout'),
        _               = require('underscore'),
        $               = require('jquery'),

        SearchViewModel = require('app/viewModels/search'),
        mapModule       = require('app/viewModels/map'),
        PlaceViewModel  = require('app/viewModels/place'),
        ;

    return function (data) {
        // child viewModels and class variables declaration
        var map             = new mapModule.Map();
        var places          = null;
        var activePlace     = ko.observable(null);
        var searchViewModel = new SearchViewModel();

        // IIFE as init function in constructor
        // to separate initalization process
        (function init (data) {
            var list = data.map(function (placeData) {
                return new PlaceViewModel(placeData);
            });

            // sort it on descending order of rating
            places = _.sortBy(list, function (place) {
                return -place.rating;
            });
        })(data);

        /*
        *   @description: filter out the place list (by alter their visibility)
        *       according to what you type in the search box
        */
        function doFiltering (text) {
            places.forEach(function (place) {
                if (text === "" || place.name.toLowerCase().includes(text.toLowerCase())) {
                    place.visible(true);
                } else {
                    place.visible(false);

                    if (place === activePlace()) {
                        activePlace(null);
                    }
                }
            });
        }

        /*
        *   @description: update the currently selected (clicked) place
        */
        function setActivePlace (place) {
            if (activePlace() !== place) {
                activePlace(place);
                map.setCenter(place.location); // center map at the active place
            }
        };


        /*
        * @description: wire PlaceListView to GooglMapView in terms of
        * filtered places and current active place
        */
        return {
            wireViews: function () {

                // wire placeViewModel <--> mapViewModel
                // wire the visibility of the place on the list
                // to that of the marker on the map
                var markers = map.createMarkers(places);
                places.forEach(function (place, i) {
                    place.marker = markers[i];
                    place.visible.subscribe(function (isVisible) {
                        markers[i].setVisible(isVisible);
                    });

                    // bind mouse-click event on the map to setActivePlace
                    place.marker.addListener('click', function (event) {
                        setActivePlace(place);
                    });
                });

                // wire searchViewModel <--> placeViewModel
                // wire Places to changes on SearchForm' filtering text
                searchViewModel.text.subscribe(doFiltering);

                // wire activePlace (and those dependent on it, such as placeViewModel) <--> mapViewModel and infoWindow
                activePlace.subscribe(function (place) {
                    if (place !== null) {
                        map.showInfoWindow(place);
                        mapModule.animateMarker(place.marker);
                    } else {
                        map.hideInfoWindow();
                    }
                });

                // Others visual / layout effects

                // wire menu visibility, which affects layout, to google map resize event
                // since google map does not redraw automatically on programmatic DOM changes
                $('#search-area').on('hidden.bs.collapse shown.bs.collapse', function (event) {
                    map.redraw(places);
                });

                // force map redraw to accomodate place column size in init phase
                setTimeout(function () {
                    map.redraw(places);
                }, 1000);
            },

            /*
            *   Set the current viewed place, which then will be emphasized visually
            *   or further presented data (in infoWindow)
            *   activePlace serves as a common point for many viewModels to listen to
            */
            setActivePlace: setActivePlace,


            // check if a place is active
            isActive: function (place) {
                return place == activePlace();
            },

            getViewModel: function (vm) {
                switch (vm) {
                    case 'search' : return searchViewModel;
                    case 'places' : return places;
                    default       : throw 'invalid request of viewModel: ' + vm;
                }
            },
        };
    };
});