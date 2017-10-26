'use strict';

var app = app || {};
    app.vm = app.vm || {};

(function () {
    app.vm.Search = function () {
        this.text = ko.observable('');
    };
})();