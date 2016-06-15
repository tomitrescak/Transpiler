import {expect} from 'chai';
import { initService, compile } from '../index';

describe('Java2Js', function() {
  beforeEach(() => {
    initService();
  })
  it('breaks on syntax errors', () => {
    // init compilation service

    const source = `class A {
  int a = Math.round(6)
}`;

    let error: { message: string} = null;
    let result: any = null;

    result = compile({ name: 'File1.java', source: source });
    console.log(result);
    expect(result.errors.length).to.equal(1);
  });

  it('workd well with base library lib.d.ts', () => {
    const source = `
      class A {
        int a = Math.round(6);
      }`;
    let result = compile({ name: 'File1.jave', source: source });

    // console.log(result.errors);
    expect(result.errors.length).to.equal(1);

    const lib = `
      class Math {
        static int round(double num) { return 0; }
      }`;

    result = compile({ name: 'File2.java', source: lib });

    console.log(result);

    expect(result.errors.length).to.equal(0);

    //expect(result.errors.length).to.equal(0);
  });
});
