"use strict";
exports.__esModule = true;
var protractor_1 = require("protractor");
var Page = (function () {
    function Page() {
    }
    Page.prototype.navigateTo = function (destination) {
        return protractor_1.browser.get(destination);
    };
    Page.prototype.getTitle = function () {
        return protractor_1.browser.getTitle();
    };
    Page.prototype.getPageOneTitleText = function () {
        return protractor_1.element(protractor_1.by.tagName('page-page1'))
            .element(protractor_1.by.tagName('ion-title'))
            .element(protractor_1.by.css('.toolbar-title'))
            .getAttribute('textContent');
    };
    return Page;
}());
exports.Page = Page;
