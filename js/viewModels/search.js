(function () {
'use strict';

/*
The viewModel for Search bar, storing the filtering text
*/

define(function (require){
    var ko = require('knockout');

    return function () {
        this.text = ko.observable('');

        // limit the rate that the filtering reacts on search term changes
        this.text.extend({ rateLimit: 200 });

        this.preventFormSubmission = function (el) {
            return false; // equiv. to do nothing
        };
    };
});
})();