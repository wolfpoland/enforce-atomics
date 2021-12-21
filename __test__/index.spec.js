"use strict";

const { ruleName } = require("../index");

testRule({
  plugins: ["./__test__/index.ts"],
  ruleName,
  config: [true, { css: "./__test__/test-file.css" }],

  accept: [
    {
      code: ".test-class { position: absolute; color: white; }",
    },
    {
      code: ".test-class { background: pink; }",
    },
  ],

  reject: [
    {
      code: ".test-class { color: red; } .test-class2 { color: white; background: black; display: flex;}",
      warnings: [
        {
          message: "Consider use of .test-fg-white (plugin/enforce-atomics)",
          column: 58,
          line: 1,
        },
        {
          message: "Consider use of .test-fg-white (plugin/enforce-atomics)",
          column: 44,
          line: 1,
        },
        {
          column: 77,
          line: 1,
          message: "Consider use of .test-flex (plugin/enforce-atomics)",
        },
      ],
    },
    {
      code: ".test-class { position: absolute; color: white; display: block; }",
      message: "Consider use of .test-display-block (plugin/enforce-atomics)",
    },
    {
      code: ".test-class { display: flex; }",
      message: "Consider use of .test-flex (plugin/enforce-atomics)",
    },
  ],
});

testRule({
  plugins: ["./__test__/index.ts"],
  ruleName,
  config: [
    true,
    {
      css: "./__test__/test-file.css",
    },
  ],

  reject: [
    {
      code: ".test-class {  display: block; width: 100%;}",
      warnings: [
        {
          message:
            "Consider use of .test-display-block (plugin/enforce-atomics)",
          column: 16,
          line: 1,
        },
        {
          message: "Consider use of .test-full-width (plugin/enforce-atomics)",
          column: 32,
          line: 1,
        },
      ],
    },
  ],
});
