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
    let result = compile({ name: 'File1.java', source: source });

    // console.log(result.errors);
    expect(result.errors.length).to.equal(1);

    const lib = `
      class Math {
        static int round(double num) { return 0; }
      }`;

    result = compile({ name: 'File2.java', source: lib }, true);
    console.log(result);

    expect(result.errors.length).to.equal(0);

    // now recompile original file and all shall be well
    result = compile({ name: 'File1.java', source: source });
    console.log(result);

    // console.log(result.errors);
    expect(result.errors.length).to.equal(0);
  });

  it('finds correct lines', () => {
    const source = `class A {


        int a = "2"; int b = "3";
      }`;
    let result = compile({ name: 'File1.java', source: source });
    console.log(result);
    console.log(result.errors);
    expect(result.errors.length).to.equal(2);
    expect(result.errors[0].line).to.equal(3);
    expect(result.errors[1].line).to.equal(3);
  });

  it('finds correct lines', () => {
    const source = `class A {
        boolean a =
          (3 && true) ||
          (4 && false);
      }`;
    let result = compile({ name: 'File1.java', source: source });
    console.log(result);
    console.log(result.errors);
    expect(result.errors.length).to.equal(5);
    expect(result.errors[0].line).to.equal(2);
    expect(result.errors[1].line).to.equal(3);
  });
});
