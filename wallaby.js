module.exports = (wallaby) => {
  var load = require;

  return {
    files: [
      "imports/parser.js",
      "client/src/tests/stubs.js",
      "client/src/*.ts",
      "client/src/config/*.ts",
      "client/src/visitors/*.ts",
      "client/src/visitors/factories/*.ts",
    ],
    tests: [
      { pattern: 'client/**/*.yaml', instrument: true, load: false, ignore: false },
      "client/src/tests/*.ts"
    ],

    compilers: {
      "**/*.ts*": wallaby.compilers.typeScript({
        module: "commonjs",
        jsx: "react"
      })
    },
    testFramework: "mocha",
    setup: function(wallaby) {
      //wallaby.testFramework.DEFAULT_TIMEOUT_INTERVAL = 5000;
      var mocha = wallaby.testFramework;
      mocha.timeout(60000);
    },
    env: {
      type: "node"
    },
  };
};
