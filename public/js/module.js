angular.module('my-app', [])
.controller('my-ctrl', ['$scope', function(scope) {
    scope.code = '';
    scope.element = null;
    scope.jscode = 'test';
    scope.createCode = function() {
        domTree = [];
        styleTree = {};
        styleSettingTree = [];
        textTree = [];
        relationTree = [];
        el = scope.element;
        analysisDom(el);
        scope.jscode = createCode();
    }
}])
.directive('htmlstr', function() {
    return {
        restrict: 'AE',
        scope: {
            result: '=',
            target: '='
        },
        link: function(scope, el, attr) {
            scope.$watch('result', function (html) {
                el.html(html || '');
            });
            scope.target = el;
        }
    };
});
var domTree = [];
var styleTree = {};
var styleSettingTree = [];
var textTree = [];
var relationTree = [];
function analysisDom(el) {
    var current = $(el);
    if (current.is('style')) { return 'style'; }
    if (current.is('text')) { return 'text'; }
    var name = current.attr('name');
    if (name) { 
        var tag = current[0].tagName.toLowerCase();
        domTree.push('var ' + name + ' = document.createElement("' + tag + '");');
    }
    if (tag === 'img') {
        var src = current.attr('src');
        var temp = domTree[domTree.length - 1];
        temp += '\n' + name + '.src = "' + (src || '') + '"';
        domTree[domTree.length - 1] = temp;
    }
    current.children().each(function(index, child) {
        var type = analysisDom(child);
        switch (type) {
            case 'style':
                createStyle(child);
                break;
            case 'text':
                createText(child, name);
                break;
            default:
                createElement(child, name);
                break;
        }
    }); 
}
function createElement(child, parent) {
    var childName = $(child).attr('name');
    var className = child.className;
    if (!className) { return; }
    className = className.replace('.', '').replace('#', '');
    if (styleTree[className]) {
        styleSettingTree.push(childName + '.style.cssText = getCssText(' + className +');');
    }
    if (!parent) { return; }
    relationTree.push(parent + '.appendChild(' + childName + ');');
}
function createText(child, parent) {
    if (!parent) { return; }
    if (!child.innerText) { return; }
    textTree.push(parent + '.innerHTML = "' + child.innerText + '";');
}
function createStyle(style) {
    var innerText = style.innerText;
    if (!innerText) { return; }
    var styleObjects = CSSJSON.toJSON(innerText);
    var keys = Object.keys(styleObjects.children);
    var key = null;
    var styleObject = null;
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        styleObject = styleObjects.children[key];
        if (!styleObject.attributes) { continue; }
        key = key.replace('.', '').replace('#', '');
        styleTree[key] = JSON.stringify(styleObject.attributes);
    }
}
function createCode() {
    var code = '';
    code += domTree.join('\n');
    code += '\n';
    var keys = Object.keys(styleTree);
    $.each(keys, function(index, key) {
        code += 'var '+ key +' = getCssReset(' + styleTree[key] + ');';
        code += '\n'
    });
    code += styleSettingTree.join('\n');
    code += '\n';
    code += relationTree.join('\n');
    code += '\n';
    return code;
}