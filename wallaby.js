module.exports = (wallaby) => {
  var load = require;

  return {
    files: [
      "pegjs/parser.js",
      "client/src/tests/stubs.js",
      "java2ts/*.js",
      "java2ts/*.ts",
      "java2ts/config/*.ts",
      "java2ts/visitors/*.ts",
      "java2ts/visitors/factories/*.ts",
      "ts2js/*.ts",
      "java2js/*.ts"
    ],
    tests: [
      { pattern: 'java2ts/**/*.yaml', instrument: true, load: false, ignore: false },
      "java2ts/tests/*.ts",
      "ts2js/tests/*.ts",
      "java2js/tests/*.ts"
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
