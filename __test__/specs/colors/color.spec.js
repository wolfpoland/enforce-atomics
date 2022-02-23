const { ruleName } = require("../../index");

testRule({
  plugins: ["./__test__/index.ts"],
  ruleName,
  config: [true, { css: "./__test__/specs/colors/color.css" }],

  accept: [],

  reject: [
    {
      code: ".test-class { color: pink }",
      message: "Consider use of .color (plugin/enforce-atomics)",
    },
  ],
});
