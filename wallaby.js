module.exports = (wallaby) => {
  var load = require;

  return {
    files: [
      "imports/parser.js",
      "client/src/tests/stubs.js",
      "client/src/*.ts",
      "client/src/config/*.ts",
      "client/src/visitors/*.ts",
    ],
    tests: [
      { pattern: 'client/**/*.yaml', instrument: true, load: false, ignore: false },
      "client/src/tests/*.ts"
    ],
    // There is a weird error with the mui and mantra.
    // See: https://goo.gl/cLH8ib
    // Using require here seems to be the error.
    // Renaming it into `load` just fixed the issue.
    compilers: {
      // "**/*.js*": wallaby.compilers.babel({
      //   babel: load("babel-core"),
      //   presets: ["es2015", "stage-2", "react"]
      // }),
      "**/*.ts*": wallaby.compilers.typeScript({
        module: "commonjs",
        jsx: "react"
      })
    },
    env: {
      type: "node"
    },
  };
};
