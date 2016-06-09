"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses enums', function () {
        cases_test_1.default({
            name: 'Enum Test',
            file: 'cases/enum_declaration.yaml',
        });
    });
});
