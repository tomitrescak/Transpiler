import runTest from '../cases_test';

describe('Parser', function() {
  it('checks correct types', () => {
    runTest({
      name: 'Type Checks Test',
      file: 'cases/type_checks.yaml',
      template: 'class Foo {\n$body\n}\n',
      outputTemplate: 'class Foo {\n  $body\n}\n'
    });
  });
});
