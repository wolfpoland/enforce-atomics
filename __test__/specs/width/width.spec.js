const { ruleName } = require("../../index");

testRule({
  plugins: ["./__test__/index.ts"],
  ruleName,
  config: [true, { css: "./__test__/specs/width/width.css" }],

  accept: [],

  reject: [
    {
      code: ".test-class { width: 500px; }",
      message: "Consider use of .container (plugin/enforce-atomics)",
    },
  ],
});
