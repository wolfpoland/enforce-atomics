"use strict";

const { run, messages } = require("./dist/main");
const { config } = require("./dist/config");

module.exports = run();

module.exports.ruleName = config.ruleName;
module.exports.messages = messages;
