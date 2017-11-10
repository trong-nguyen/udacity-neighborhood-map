'use strict';

/*
The viewModel for Google Maps
Handle all the Google Maps API internally
Only expose app-related methods
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function (google, services) {
    var module = app.viewModels;

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
        var infoWindow = module.infoWindow();

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

        this.redraw = function (places) {
            google.maps.event.trigger(googleMap, 'resize');
            if (places !== undefined) {
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function (p) {
                    bounds.extend(p.marker.getPosition());
                });
                googleMap.fitBounds(bounds);
            }
        };
    };
})(google, app.models);