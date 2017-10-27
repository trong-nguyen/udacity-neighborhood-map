'use strict';

/*
The viewModel for Google Maps
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function (google, services, utils) {

    app.viewModels.Map = function () {
        this.map = services.getMap();
        this.markers = [];
        this.infoHolder = new google.maps.InfoWindow();


        this.addMarkers = (function (places) {
            var currentMap = this.map; // get a hold of the map

            this.markers = places.map(function (place) {
                var marker = new google.maps.Marker({
                    position: place.location,
                    map: currentMap,
                    title: place.name
                });

                marker.addListener('click', function () {
                    populateInfoWindow(currentMap, place, marker);
                });

                return marker;
            });

            return this.markers;
        }).bind(this);

        var populateInfoWindow = (function (map, place, marker) {
            // reuse the infoHolder for every infoWindow
            var info = this.infoHolder;
            if (info.marker != marker) {
                info.marker = marker;
                info.open(map, marker);

                // asynchronously load content into window
                utils.compileTemplate('info-window', place, function (content) {
                    info.setContent(content);
                });

                info.addListener('closeclick', function () {
                    info.marker = null;
                });
            }
        }).bind(this);
    };
})(google, app.models, app.utils);