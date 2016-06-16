import runTest from '../cases_test';

describe('Parser', function() {
  it('parses functions', () => {
    runTest({
      name: 'Functions',
      file: 'cases/functions.yaml',
      template: 'class Foo {\n$body\n}\n',
      outputTemplate: 'class Foo {\n  $body\n}\n'
    });
  });
});
