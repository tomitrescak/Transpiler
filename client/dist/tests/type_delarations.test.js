"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses type declarations', function () {
        cases_test_1.default({
            name: 'General Test',
            file: 'cases/type_declaration.yaml',
        });
    });
});
