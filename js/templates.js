'use strict';

/*
*   @description: an experimental attemp to build a non-trivial AMD module
*       Basically I want to build a module that pre-loaded templates
*       and return the named template on calling .get(name)
*/
(function () {
    // list all templates to be exported
    var templateNames = [
        'info-window',
    ];

    // formulate template require using requirejs-text plugin
    var templateRequire = templateNames.map(function (tp) {
        return ['text!../templates/', tp, '.html'].join('')
    });

    // real AMD module definition
    define(templateRequire, function () {
        var templates = {};
        var loadedTemplates = arguments; // get ahold of arguments

        templateNames.forEach(function (name, index) {
            templates[name] = loadedTemplates[index];
        });

        return templates;
    });
})();
