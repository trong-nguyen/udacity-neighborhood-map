'use strict';

/*
The viewModel for place items, storing transformed properties
and methods of each place of interest.
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function () {
    app.viewModels.Place = function (data) {
        this.name = ko.observable(data.name);
        this.icon = ko.observable(data.icon);
        this.placeID = ko.observable(data.id);
        this.visible = ko.observable(true);
    };
})();