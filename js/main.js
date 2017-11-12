'use strict';

define(function (require) {

    // do initialization for utils, models (data)
    return function () {
        var loaded = Promise.all([
            app.utils.init(),
            app.models.init(),
            ]);

        // then instantiate viewModels, functional wiring and Knockout binding
        loaded.then(function (results) {
            var data = app.models.getData()
            var viewModel = app.createMainViewModel(data);
            viewModel.wireViews();
            ko.applyBindings(viewModel);
        }).catch(function (error) {
            console.error('Failed app initialization:', error);
            alert('App initialization failed, refresh or try again later!')
        });
    };
});