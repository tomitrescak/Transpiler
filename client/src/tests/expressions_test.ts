import runTest from '../cases_test';

describe('Parser', function() {
  it('parses expressions', function() {
    runTest({
      name: 'Expressions Test',
      file: 'cases/expressions.yaml',
    })
  });
});
