'use strict';

require.config({
    baseUrl: 'js',

    paths: {
        // jquery is a named AMD module (jquery), any other name (moduleID) will cause undefined error
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

// error display during require-ing modules
require.onError = function (error) {
    var elm = document.getElementById('app-status-message');

    var message =
        '<h4>Internal Error</h4>' +
        '<p>Details: ' + String(error) + '</p>';

    elm.innerHTML = message;
    elm.parentElement.className += ' alert-danger';
    throw error;
};

// work-around for the quirky Popper issue on initiating Bootstrap JS
require(['popper'], function (popper) {
    window.Popper = popper;
    require(['bootstrap']); // let bootstrap init
});


// main logic
require([
        'knockout',
        'models/services',
        'viewModels/status',
        'viewModels/master',
        'models/preset',
    ], function (
        ko,
        services,
        Status,
        masterViewModel,
        preset
        ) {

        // main status heading
        var status = new Status();
        ko.applyBindings(status, document.getElementById('app-status'));

        status.info('Modules loaded. Getting data ...');

        services
            .getPlaces(preset.place)
            .then(function (placesData) {
                status.info('Data loaded. Binding views ...');
                var viewModel = masterViewModel(placesData);
                ko.applyBindings(viewModel, document.getElementById('app'));

                status.success('App sucessfully loaded!');
            }).catch(function (error) {
                console.error('Failed app initialization:', error);

                status.error('App initialization failed, refresh or try again later!');
            });
});