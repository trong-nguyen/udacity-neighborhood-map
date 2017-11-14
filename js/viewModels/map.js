'use strict';


/*
    @description: a view that wraps google.maps.Map
        and marker, infoWindow manipulations,
        handle all the Google Maps API internally
        only expose app-relevant methods
*/


define(function (require) {
    var
        google     = require('google'),
        services   = require('models/services');

    return function (location, elementID) {

        var googleMap = new google.maps.Map(document.getElementById(elementID), {
            center: location,
            zoom: 13
        });

        this.createMarkers = function (places) {
            return places.map(function (place) {
                var marker = new google.maps.Marker({
                    position : place.location,
                    map      : googleMap,
                    title    : place.name
                });

                return marker;
            });
        };

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

        this.setCenter = function (location) {
            googleMap.setCenter(location);
        };

        this.animateMarker = function (marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 700);
        };
    };
});