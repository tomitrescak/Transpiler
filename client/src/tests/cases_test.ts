import {expect} from 'chai';
import Builder from '../config/Builder';
import Messages from '../config/Messages';
import Visitor from '../visitors/Visitor';
import { transpile } from '../Java2ts';

const YAML = require('yamljs');
const parser = require('../../../imports/parser');

interface Case {
  name: string;
  description: string;
  input: string;
  output: string;
  errors: string[];
  warnings?: string[];
  infos?: string[];
  sourceMap: number[];
}

declare global {
  export var __dirname: string;
}

let casefiles = [
  { name: 'General Test', file: 'cases.yaml', template: '', outputTemplate: '' },
  { name: 'Functions', file: 'functions.yaml', template: 'class Foo {\n$body\n}\n', outputTemplate: 'class Foo {\n  $body\n}\n' },
  { name: 'Type Checks Test', file: 'type_checks.yaml', template: 'class Foo {\n$body\n}\n', outputTemplate: 'class Foo {\n  $body\n}\n' },
  //{ name: 'Type Checks Functions', file: 'type_check_functions.yaml' }
]

describe('Parser', function() {
  it('parses classes', function() {

    // browse all case files
    for (let file of casefiles) {
      let index = 0;
      let cases: Case[] = YAML.load(require('path').join(__dirname, file.file));

      for (let testCase of cases) {
        // process template
        let input = testCase.input;
        if (file.template) {
          input = file.template.replace('$body', input);
        }

        let testName = `${file.name} > (${index}) ${testCase.name}`;
        console.log('Running ' + testName);
        index++;

        // transpile to typescript
        let builder = transpile(input);

        // check output
        if (testCase.output) {
          let output = testCase.output;
          if (file.outputTemplate) {
            output = file.outputTemplate.replace('$body', output);
          }
          expect(builder.text).to.equal(output, testName);
        }

        if (testCase.warnings) {
          expect(testCase.warnings.length, `${testName}: Warnings contain\n${builder.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`).to.equal(builder.handler.warnings.length);
          for (let warning of testCase.warnings) {
            let parts = warning.split('|');
            let messageName = builder.Warnigns[parts[0]];
            let messageLine = parseInt(parts[1], 10);

            parts.splice(0, 2); // remove the first element that is message descriptor
            let message = messageName.apply(null, parts);
            let filtered = builder.handler.warnings.filter((w => w.line === messageLine && w.message === message));

            expect(filtered.length).be.equal(1, `${testName}: Did not find [${messageLine}] ${message}\nWarnings only contain:\n${builder.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`);
          }
        }

        if (testCase.errors) {
          expect(testCase.errors.length, `${testName}: Errors contain\n${builder.handler.errors.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`).to.equal(builder.handler.errors.length);
          for (let error of testCase.errors) {
            let parts = error.split('|');
            let messageName = builder.Errors[parts[0]];
            let messageLine = parseInt(parts[1], 10);

            parts.splice(0, 2); // remove the first element that is message descriptor
            let message = messageName.apply(null, parts);
            let filtered = builder.handler.errors.filter((w => w.line === messageLine && w.message === message));

            expect(filtered.length).be.equal(1, `${testName}:  Did not find [${messageLine}] ${message}\nErrors only contain:\n${builder.handler.errors.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`);
          }
        }

        if (testCase.sourceMap) {
          for (let i = 0; i < testCase.sourceMap.length; i++) {
            const line = builder.sourceMap.getLine(i);
            // console.log(JSON.stringify(builder.sourceMap))
            const filtered = line.filter((l) => l.mapping.row === testCase.sourceMap[i]);
            expect(filtered.length, `${testName}: Source map matching failed`).to.be.least(1);
          }
        }

        console.log('=======================================================')
      }
    }
  });
});
