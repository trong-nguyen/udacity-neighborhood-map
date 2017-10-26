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
        this.placeID = data.id;
        this.location = data.geometry.location;
        this.visible = ko.observable(true);
    };
})();