'user strict';

define(function(require) {
    var ko = require('knockout');

    return function () {
        var self = this;

        this.message      = ko.observable('Loading data...');
        this.visible      = ko.observable(true);
        this.currentState = ko.observable('default');

        this.error = function (message) {
            self.message(message);
            self.currentState('error');
        };

        this.success = function (message) {
            var time = 1000;
            setTimeout(function () {
                self.message(message);
                self.currentState('success');
            }, time);

            setTimeout(function () {
                self.visible(false);
            }, time + 3000);
        };

        this.info = function (message) {
            self.message(message);
            self.currentState('default');
        };

        this.is = function (state) {
            return state === self.currentState();
        };

        this.log = self.info;
    };
});