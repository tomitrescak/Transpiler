"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses classes', function () {
        cases_test_1.default({
            name: 'Classes Test',
            file: 'cases/classes.yaml',
        });
    });
});
