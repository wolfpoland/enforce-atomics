import * as postcss from "postcss";
import { createPlugin, utils } from "stylelint";
import { sourceParser } from "./domains/source-parser";
import { PluginOption } from "./types/plugin-option";
import { retrieveOptions } from "./domains/options";
import { config } from "./config";
import { SourceMetadata } from "./domains/source-parser/source-metadata";
import { currentRootParser } from "./domains/current-root-parser";
import { reporterAtomic } from "./domains/reporters/reporter-atomic";

export const messages = utils.ruleMessages(config.ruleName, {
  rejected: (atomicClass) => `Consider use of ${atomicClass.replace("\\32xl\\:", "")}`,
});

export function run(): Function {
  return createPlugin(config.ruleName, function rule(_: any, options: object | null = null) {
    return (root: postcss.Root, result: postcss.Result) => {
      const { css: pathToCssSource } = retrieveOptions(options as PluginOption);

      const sourceMetadata: SourceMetadata = sourceParser(pathToCssSource);

      currentRootParser(root, sourceMetadata);

      reporterAtomic(sourceMetadata, result);
    };
  });
}
