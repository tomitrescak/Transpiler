import runTest from '../cases_test';

describe('Parser', function() {
  it('parses classes', function() {
    runTest({
      name: 'Classes Test',
      file: 'cases/classes.yaml',
    })
  });
});
