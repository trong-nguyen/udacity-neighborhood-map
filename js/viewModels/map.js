'use strict';

/*
The viewModel for Google Maps
Handle all the Google Maps API internally
Only expose app-related methods
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function (google, services, utils) {

    app.viewModels.Map = function () {
        var self = this;

        this.map = services.getMap();
        this.markers = [];
        this.infoHolder = new google.maps.InfoWindow();
        this.infoTemplate = utils.templates['info-window'];


        this.addMarkers = function (places) {
            var currentMap = self.map; // get a hold of the map

            self.markers = places.map(function (place) {
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

            return self.markers;
        };

        var populateInfoWindow = (function (map, place, marker) {
            // reuse the infoHolder for every infoWindow
            var info = this.infoHolder;
            var compile = this.infoTemplate;
            if (info.marker != marker) {
                info.marker = marker;
                info.open(map, marker);

                // asynchronously load content into window
                info.setContent(compile(place));

                info.addListener('closeclick', function () {
                    info.marker = null;
                });
            }
        }).bind(this);
    };
})(google, app.models, app.utils);