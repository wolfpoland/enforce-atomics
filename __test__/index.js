"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
const config_1 = require("../src/config");
module.exports = (0, main_1.run)();
module.exports.ruleName = config_1.config.ruleName;
module.exports.messages = main_1.messages;
