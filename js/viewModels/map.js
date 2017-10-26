'use strict';

/*
The viewModel for Google Maps
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function (google, $) {

    app.viewModels.Map = function (services) {
        this.map = services.getMap();
        this.markers = [];


        this.addMarkers = (function (places) {
            var currentMap = this.map; // get a hold of the map

            this.markers = places.map(function (place) {
                return new google.maps.Marker({
                    position: place.location,
                    map: services.getMap(),
                    title: place.name
                });
            });

            return this.markers;
        }).bind(this);
    };
})(google, $);