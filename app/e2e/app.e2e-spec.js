"use strict";
exports.__esModule = true;
var app_po_1 = require("./app.po");
describe('App', function () {
    var page;
    beforeEach(function () {
        page = new app_po_1.Page();
    });
    describe('default screen', function () {
        beforeEach(function () {
            page.navigateTo('/');
        });
        it('should have a title saying Page One', function () {
            page.getPageOneTitleText().then(function (title) {
                expect(title).toEqual('Page One');
            });
        });
    });
});
