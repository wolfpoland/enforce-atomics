import { messages, run } from "../src/main";
import { config } from "../src/config";

module.exports = run();

module.exports.ruleName = config.ruleName;
module.exports.messages = messages;
