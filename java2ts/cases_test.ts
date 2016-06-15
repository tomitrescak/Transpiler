import {expect} from 'chai';
import { parseTree, transpileTree } from './index';
const YAML = require('yamljs');

interface CaseFile {
  name: string;
  file: string;
  template?: string;
  outputTemplate?: string;
}

interface Case {
  name: string;
  description: string;
  input: string;
  output: string;
  errors: string[];
  warnings?: string[];
  infos?: string[];
  sourceMap: number[];
  longRunning: boolean;
}

declare global {
  export var __dirname: string;
}

let runLongTests = true;

if (!global['parseCache']) {
  global['parseCache'] = {};
}
let parseCache = global['parseCache'];

export default function runTest(file: CaseFile) {
  // browse all case files
  let index = 0;
  let cases: Case[] = YAML.load(require('path').join(__dirname, 'tests', file.file));

  for (let testCase of cases) {
    let time = new Date().getTime();
    // some tests can take long time, we can decide whether to execute them
    if (testCase.longRunning && !runLongTests) {
      continue;
    }

    // process template
    let input = testCase.input;
    if (file.template) {
      input = file.template.replace('$body', input);
    }

    let testName = `${file.name} > (${index}) ${testCase.name}`;
    console.log('Running: ' + testName);
    index++;

    // find parsed version of the test item
    if (!parseCache[file.name]) {
      parseCache[file.name] = {};
    }
    if (!parseCache[file.name][testCase.name]) {
      parseCache[file.name][testCase.name] = { input: input, output: parseTree(input) };
      console.log('First time ...');
    }

    let parsed = parseCache[file.name][testCase.name];
    if (parsed.input !== input) {
      parsed.source = input;
      parsed.output = parseTree(input);
    }

    // transpile to typescript
    let builder = transpileTree(parsed.output);

    // check output
    if (testCase.output) {
      let output = testCase.output;
      if (file.outputTemplate) {
        output = file.outputTemplate.replace('$body', output.trim());
      }
      expect(builder.text).to.equal(output, testName);
    }

    if (!testCase.warnings) {
      testCase.warnings = [];
    }
    if (!testCase.errors) {
      testCase.errors = [];
    }

    expect(testCase.warnings.length, `${testName}: Warnings contain\n${builder.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`).to.equal(builder.handler.warnings.length);
    if (testCase.warnings) {
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

    expect(testCase.errors && testCase.errors.length, `${testName}: Errors contain\n${builder.handler.errors.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`).to.equal(builder.handler.errors.length);
    if (testCase.errors) {
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
        expect(filtered.length, `${testName}: Source map matching failed ${i} -> ${testCase.sourceMap[i]}, current sourceMap:\n${JSON.stringify(builder.sourceMap,null,2)}`).to.be.least(1);
      }
    }

    let duration = new Date().getTime() - time;
    console.log("Duration: " + duration + "ms");
    console.log('=======================================================')
  }
}
