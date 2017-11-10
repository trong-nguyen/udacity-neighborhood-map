'use strict';

/*
The viewModel for InfoWindow openned from within Google Maps
Handle all the media data queries and data present on the infoWindow.
Only one infoWindow is present at a time
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function (google, services, utils) {
    var module = app.viewModels;

    module.infoWindow = function () {
        /*
            A singleton that wraps around google.maps.InfoWindow
            and the targeted marker and a template to render
        */

        var _marker = null,
        infoWindow  = new google.maps.InfoWindow(),
        template    = utils.templates['info-window']
        ;

        function renderEmbeddedTweets() {
            /*
                @description:
                    - A self-contained utility to render embedded tweets
                    using Twitter Dev JS rendering tool.
                    - It looks for unrendered tweets in a specific format,
                    render and convert them to rendered format.
                    - Each unrendered tweet must has the following format
                    <div class="unrendered-tweet" tweet-id=TWEET_ID></div>
            */
            var containerClass = 'info-window';
            var identifyingClass = 'unrendered-tweet';

            var elms = $(['.' + containerClass, '.' + identifyingClass].join(' '));

            elms.each(function (_, el) {
                utils.twitter.widgets.createTweet(
                    el.getAttribute('tweet-id'),
                    el,
                    {
                        cards: 'hidden' //Hide photos, videos, and link previews powered by Cards.
                    }
                );
            });

            // cleanup to prevent re-render
            elms.removeClass(identifyingClass);
        }

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
                        var ypData = resultsArray[0];
                        content.yelp = {};
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
                        var fsData = resultsArray[1];
                        content.foursquare = {};
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
                        var ttData = resultsArray[2];
                        content.tweets = ttData.map(function (t) { return t.id_str; });

                        console.info(content);

                        content.description = utils.uniq(content.description).join(', ');

                        resolve(content);
                    })
                    .catch(function (reason) {
                        console.log('Failed request data from 3rd-party APIs', reason);
                        reject(reason);
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
                    loadContent(place)
                        .then(function (content) {
                            var html = template(content);
                            infoWindow.setContent(html);

                            // tweets are not rendered in the templating process
                            // due to their embedding natures
                            renderEmbeddedTweets();
                        })
                        .catch(function (reason) {
                            infoWindow.setContent(
                                "<h3>Cannot load data. API error!</h3>"
                                );
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
})(google, app.models, app.utils);