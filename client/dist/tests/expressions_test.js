"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses expressions', function () {
        cases_test_1.default({
            name: 'Expressions Test',
            file: 'cases/expressions.yaml',
        });
    });
});
