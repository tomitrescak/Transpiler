import runTest from '../cases_test';

describe('Parser', function() {
  it('parses function parameters', function() {
    runTest({
      name: 'Function Parameters Test',
      file: 'cases/function_parameters.yaml',
      template: 'class Foo {\n$body\n}\n',
      outputTemplate: 'class Foo {\n  $body\n}\n'
    })
  });
});
