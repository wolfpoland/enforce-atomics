const { ruleName } = require("../../index");

testRule({
  plugins: ["./__test__/index.ts"],
  ruleName,
  config: [true, { css: "./__test__/specs/flex/flex.css" }],

  accept: [],

  reject: [
    {
      code: ".test-class { display: flex; }",
      message: "Consider use of .flex (plugin/enforce-atomics)",
    },
  ],
});
