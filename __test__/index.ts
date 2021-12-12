import { config } from "../src/config";
import { messages, run } from "../src/main";

module.exports = run();

module.exports.ruleName = config.ruleName;
module.exports.messages = messages;
