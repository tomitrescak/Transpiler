import {expect} from 'chai';

import runTest from '../cases_test';
import { initService, serviceCompile } from '../index';

describe('Parser', function() {
  it('parses multiple files', function() {
    let file1 = { name: 'file1', source: `interface Math1 { static int round(float num); }` };
    let file2 = { name: 'file2', source: `class Foo { int a = Math.round(3.14); }` };

    let result = initService([file1, file2]);

    expect(result.errors.length).to.equal(1);

    console.log(result);
    console.log('1. -----------------------------------');

    file1 = { name: 'file1', source: `interface Math { static int round(float num); }` };
    result = serviceCompile(file1);
    expect(result.errors.length).to.equal(0);

    console.log(result);
    console.log('2. -----------------------------------')

    result = serviceCompile(file2);
    console.log(result)
    expect(result.errors.length).to.equal(0);
  });
});
