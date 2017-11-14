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

// work-around for the quirky Popper issue on initiating Bootstrap JS
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
        'knockout',
        'models/services',
        'viewModels/master',
        'models/preset',
    ], function (
        ko,
        services,
        masterViewModel,
        preset
        ) {

        services
            .getPlaces(preset.place)
            .then(function (placesData) {
                var viewModel = masterViewModel(placesData);
                ko.applyBindings(viewModel);
            }).catch(function (error) {
                console.error('Failed app initialization:', error);
                alert('App initialization failed, refresh or try again later!')
            });
});