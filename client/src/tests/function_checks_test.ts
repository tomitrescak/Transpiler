import runTest from '../cases_test';

describe('Parser', function() {
  xit('type checks functions', () => {
    runTest({
      name: 'Type Checks Functions',
      file: 'cases/type_check_functions.yaml'
    })
  })
});
