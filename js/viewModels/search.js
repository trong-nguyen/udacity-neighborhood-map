'use strict';

/*
The viewModel for Search bar, storing the filtering text
*/

var app = app || {};
    app.viewModels = app.viewModels || {};

(function () {
    app.viewModels.Search = function () {
        this.text = ko.observable('');

        // limit the rate that the filtering reacts on search term changes
        this.text.extend({ rateLimit: 200 });
    };
})();