import {expect} from 'chai';
import { compileString } from '../index';

describe('Parser', function() {
  it('checks correct types', () => {
    const source = `
      class A { private a: number };
      class B { constructor() { new A().a }}`
    const result = compileString(source, null, null, (err) => {
      console.log(err);
    });

    //console.log(result);

    expect(true).to.equal(false);
  });
});
