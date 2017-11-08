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
            infoWindow = new google.maps.InfoWindow({
                content: '',
                // disableAutoPan: true
            }),
            template = utils.templates['info-window'];

        function loadContent(place) {
            var content = Object.assign({}, place); // copy
            content.description = [];

            var latlng = {
                lat: place.location.lat(),
                lng: place.location.lng()
            };

            return new Promise (function (resolve, reject) {
                Promise.all([
                        services.getYelp(place.name, latlng),
                        services.getFoursquare(place.name, latlng),
                        services.getTweets(place.name, latlng),
                    ])
                    .then(function (resultsArray) {
                        // get results from array

                        // Yelp
                        content.yelp = {};
                        var ypData = resultsArray[0];
                        if (ypData.length) {
                            var data = ypData[0];
                            content.yelp = data;

                            // set photo to Yelp's if not available
                            content.photo = content.photo || data.image_url;

                            var description = data.categories.map(function (c) {
                                return c.alias;
                            });
                            content.description = content.description.concat(description);
                        }

                        // 4square
                        content.foursquare = {};
                        var fsData = resultsArray[1];
                        if (fsData.length) {
                            var data = fsData[0];
                            content.foursquare = data;
                            content.foursquare.url = 'https://foursquare.com/v/' + data.id;


                            var description = data.categories.map(function (c) {
                                return c.name.toLowerCase();
                            });
                            content.description = content.description.concat(description);
                        }

                        // Twitter
                        content.tweets = resultsArray[2];
                        console.info(content);

                        content.description = utils.uniq(content.description).join(', ');

                        resolve(content);
                    });
            });
        }

        return {
            open: function (map, place, marker) {
                if (marker !== null && _marker !== marker) {
                    infoWindow.setContent('');

                    _marker = marker;
                    infoWindow.open(map, marker);

                    // asynchronously load content into window
                    loadContent(place).then(function (content) {
                        var html = template(content);
                        infoWindow.setContent(html);
                        GX.test = infoWindow;
                    });

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

        this.redraw = function () {
            google.maps.event.trigger(googleMap, 'resize');
        };
    };
})(google, app.models, app.utils);