import runTest from '../cases_test';

describe('Parser', function() {
  it('parses field declarations', function() {
    runTest({
      name: 'Field Declaration Test',
      file: 'cases/field_declaration.yaml',
    })
  });
});
