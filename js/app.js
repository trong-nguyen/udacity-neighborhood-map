'use strict';

function errorLoadingLibrary(lib) {
    console.error('Error loading library', lib, ', try again later!');
}

require.config({
    baseUrl: 'js',

    paths: {
        // jquery is a named AMD module (jquery), any other name will cause undefined error
        jquery     : '//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery',
        popper     : '//cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.7/umd/popper.min',
        bootstrap  : '//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min',
        twttr      : '//platform.twitter.com/widgets',
        underscore : '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        knockout   : '//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min',
        google     : '//maps.googleapis.com/maps/api/js?key=AIzaSyBzpVxGO1087J3Hm1hPSqtvsuY6sIlhZq0&libraries=places',
        text       : '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min', // plugin
    },


    shim: {
        // bootstrap js will become a jquery plugin once loaded,
        // so no need to export
        bootstrap: {
            deps: ['jquery', 'popper']
        },

        google: {
            exports: 'google'
        },

        twttr: {
            exports: 'twttr'
        }
    }
});

// walk-around for the quirky Popper issue on initiating Bootstrap JS
require(['popper'], function (popper) {
    window.Popper = popper;
    require(['bootstrap']); // let bootstrap init
});


/*
*   @description: the parent viewModel that manages other component viewModels
*       kind of a controller for viewModels. The mainViewModel is a singleton
*       since by design only one mainViewModel is required for an app.
*/
require([
    'jquery',
    'knockout',
    'underscore',

    'viewModels/search',
    'viewModels/map',
    'viewModels/place',
    'utils',
    'models/services',
    ],
function (
    $,
    ko,
    _,

    SearchViewModel,
    mapModule,
    PlaceViewModel,
    utils,
    services
    ) {

    function controller (data) {
        // child viewModels and class variables declaration
        var mapViewModel    = new mapModule.Map();
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
                mapViewModel.setCenter(place.location); // center map at the active place
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
                var markers = mapViewModel.createMarkers(places);
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
                        mapViewModel.showInfoWindow(place);
                        mapModule.animateMarker(place.marker);
                    } else {
                        mapViewModel.hideInfoWindow();
                    }
                });

                // Others visual / layout effects

                // wire menu visibility, which affects layout, to google map resize event
                // since google map does not redraw automatically on programmatic DOM changes
                $('#search-area').on('hidden.bs.collapse shown.bs.collapse', function (event) {
                    mapViewModel.redraw(places);
                });

                // force map redraw to accomodate place column size in init phase
                setTimeout(function () {
                    mapViewModel.redraw(places);
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
    }

    var loaded = Promise.all([
        services.fetchData(),
        ]);

    // then instantiate viewModels, functional wiring and Knockout binding
    loaded.then(function (results) {
        var data = services.getData()
        var viewModel = controller(data);
        viewModel.wireViews();
        ko.applyBindings(viewModel);
    }).catch(function (error) {
        console.error('Failed app initialization:', error);
        alert('App initialization failed, refresh or try again later!')
    });
});