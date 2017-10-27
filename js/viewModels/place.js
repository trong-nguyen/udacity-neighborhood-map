'use strict';

/*
The viewModel for place items, storing transformed properties
and methods of each place of interest.
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function () {
    app.viewModels.Place = function (data) {
        this.name = data.name;
        this.icon = data.icon;
        this.placeID = data.place_id;
        this.location = data.geometry.location;
        this.address = data.formatted_address;
        // this.photo = data.photos.length ? data.photos[0].getUrl() : '';
        this.visible = ko.observable(true);
    };
})();