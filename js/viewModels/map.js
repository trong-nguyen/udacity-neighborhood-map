'use strict';

/*
The viewModel for Google Maps
Handle all the Google Maps API internally
Only expose app-related methods
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function (google, services, utils) {
    var module = app.viewModels;

    var infoWindowFactory = function (argument) {
        /*
            A singleton that wraps around google.maps.InfoWindow
            and the targeted marker and a template to render
        */

        var _marker = null,
            infoWindow = new google.maps.InfoWindow(),
            template = utils.templates['info-window'];

        return {
            open: function (map, place, marker) {
                if (marker !== null && _marker !== marker) {
                    _marker = marker;
                    infoWindow.open(map, marker);

                    // asynchronously load content into window
                    infoWindow.setContent(template(place));

                    infoWindow.addListener('closeclick', function () {
                        _marker = null;
                    });
                }
            },

            close: function () {
                // The native infoWindow.close() does not disconnect this
                // to a prior opening (e.g. with open(priorMap, priorMarker))
                // hence a change to priorMarker indirectly changes this infoWindow behaviors
                // However, another call of open(null) indirectly disconnect all prior
                // open(s) which is exactly what we want
                infoWindow.open(null);
                _marker = null;
            }
        }
    };

    module.animateMarker = function (marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 700);
    }

    module.Map = function () {
        /*
            A map that wraps google.maps.Map
            and marker, infoWindow manipulations
        */

        var googleMap = services.getMap();
        var infoWindow = infoWindowFactory();

        this.createMarkers = function (places) {
            return places.map(function (place) {
                var marker = new google.maps.Marker({
                    position: place.location,
                    map: googleMap,
                    title: place.name
                });

                marker.addListener('click', function () {
                    infoWindow.open(googleMap, place, marker);
                    module.animateMarker(marker);
                });

                return marker;
            });
        };

        this.showInfoWindow = function (place) {
            infoWindow.open(googleMap, place, place.marker);
        };

        this.hideInfoWindow = infoWindow.close;

        this.getMap = function () {
            return googleMap;
        };
    };
})(google, app.models, app.utils);