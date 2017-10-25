'use strict';

var app = app || {};
    app.models = app.models || {};

(function () {
    app.models.Place = function (data) {
        this.name = ko.observable(data.name);
        this.icon = ko.observable(data.icon);
        this.place_id = ko.observable(data.id);
        this.visible = ko.observable(true);
    };
})();