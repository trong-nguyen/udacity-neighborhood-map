'user strict';

/*
*   @descriptions: a master, singleton viewModel that takes
*       responsibility of instantiating component ViewModels
*       and wire their functionalities, cosmetic-wise
*/
define(function (require) {
    var
        $                   = require('jquery'),
        ko                  = require('knockout'),
        _                   = require('underscore'),

        SearchViewModel     = require('viewModels/search'),
        MapViewModel        = require('viewModels/map'),
        PlaceViewModel      = require('viewModels/place'),
        InfoWindowViewModel = require('viewModels/infoWindow'),
        preset              = require('models/preset');

    return function (data) {
        // child viewModels and class variables declaration
        var
            map             = new MapViewModel(preset.place.location, 'google-map'),
            infoWindow      = new InfoWindowViewModel(),
            searchViewModel = new SearchViewModel(),
            places          = null,
            markers         = null,
            activePlace     = ko.observable(null);

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

            markers = map.createMarkers(places);

            // wire places <--> map
            // wire the visibility of a place on the list
            // to that of the marker on the map
            places.forEach(function (place, i) {
                place.marker = markers[i];
                place.visible.subscribe(function (isVisible) {
                    markers[i].setVisible(isVisible);
                });

                // bind mouse-click event on the map to setActivePlace
                place.marker.addListener('click', function (event) {
                    setActivePlace(place);
                    infoWindow.open(map.getMap(), place);
                    map.animateMarker(place.marker);
                });
            });

            // wire search field <--> places
            // wire places to changes on SearchForm' filtering text
            searchViewModel.text.subscribe(doFiltering);

            // wire activePlace (and those dependent on it, such as places) <--> map and infoWindow
            activePlace.subscribe(function (place) {
                if (place !== null) {
                    infoWindow.open(map.getMap(), place);
                    map.animateMarker(place.marker);
                } else {
                    infoWindow.close();
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


        // return public methods for calling in data-bind on DOM elms
        return {
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
                    case 'status' : return status;
                    default       : throw 'invalid request of viewModel: ' + vm;
                }
            },
        };
    }
});