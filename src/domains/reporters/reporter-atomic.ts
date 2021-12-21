import * as postcss from "postcss";
import { utils } from "stylelint";
import { config } from "../../config";
import { messages } from "../../main";
import { SourceMetadata } from "../source-parser/source-metadata";
import { PropertyValuePair } from "../../types/property-value-pair";

export function reporterAtomic(sourceMetadata: SourceMetadata, result: postcss.Result) {
  const { selectorsToPropertyPairNode } = sourceMetadata;

  selectorsToPropertyPairNode.forEach((propertiesPairToNode: Map<PropertyValuePair, postcss.Node | null>, selector: string) => {
    const nodes: Array<postcss.Node | null> = Array.from(propertiesPairToNode.values());

    const isReportNecessary = nodes.every((property) => !!property);

    if (isReportNecessary) {
      // @ts-ignore
      nodes.forEach((node: postcss.Node) => {
        utils.report({
          message: messages.rejected(selector),
          node,
          result,
          ruleName: config.ruleName,
        });
      });
    }
  });
}
