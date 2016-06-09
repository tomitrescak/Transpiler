"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('creates source maps', function () {
        cases_test_1.default({
            name: 'Source Map Test',
            file: 'cases/source_maps.yaml',
        });
    });
});
