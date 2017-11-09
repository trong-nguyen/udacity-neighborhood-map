'use strict';

/*
The viewModel for place items, storing transformed properties
and methods of each place of interest.
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function () {
    var placePhotoConfigs = {
        maxWidth: 300,
        maxHeight: 300
    };

    app.viewModels.Place = function (data) {
        this.name     = data.name;
        this.icon     = data.icon;
        this.placeID  = data.place_id;
        this.location = data.geometry.location;
        this.address  = data.formatted_address;
        this.rating   = data.rating || 'na';
        this.photo    = (data.photos && data.photos.length) ? data.photos[0].getUrl(placePhotoConfigs) : '';
        this.visible  = ko.observable(true);
        this.marker   = null;
    };
})();