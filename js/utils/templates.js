(function () {
'use strict';

/*
*   @description: an experimental attemp to build a non-trivial AMD module
*       Basically I want to build a module that pre-loaded templates
*       and return the named template on calling .get(name)
*/
// list all templates to be exported
var templateNames = [
    'info-window',
];

var templateFolder = '../../templates';

// formulate template require using requirejs-text plugin
var templateRequire = templateNames.map(function (tp) {
    return ['text!', templateFolder, '/', tp, '.html'].join('');
});

var deps = ['underscore'];

// real AMD module definition
define(deps.concat(templateRequire), function () {
    var _ = arguments[deps.indexOf('underscore')];

    var templates = {};
    for (var i=deps.length; i<arguments.length; ++i) {
        var name = templateNames[i-deps.length];
        var loadedTemplate = arguments[i];
        templates[name] = _.template(loadedTemplate);
    }

    return templates;
});
})();
