"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses field declarations', function () {
        cases_test_1.default({
            name: 'Field Declaration Test',
            file: 'cases/field_declaration.yaml',
        });
    });
});
