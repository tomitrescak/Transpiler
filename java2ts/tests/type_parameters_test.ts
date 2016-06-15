import runTest from '../cases_test';

describe('Parser', function() {
  describe('Parser', function() {
    it('parses type parameters', function() {
      runTest({
        name: 'Parameter Test',
        file: 'cases/type_parameters.yaml',
      })
    });
  });
});
