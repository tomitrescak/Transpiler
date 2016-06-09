"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses modifiers', function () {
        cases_test_1.default({
            name: 'Modifer Test',
            file: 'cases/modifiers.yaml',
        });
    });
});
