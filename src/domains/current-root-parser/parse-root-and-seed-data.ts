import * as postcss from "postcss";
import { SourceMetadata } from "../source-parser/source-metadata";
import { createPropertyValuePair, PropertyValuePair } from "../../types/property-value-pair";
import { Selector } from "../../types/selector";

export function parseRootAndSeedData(rule: postcss.Rule, sourceMetadata: SourceMetadata) {
  const { selectorsToPropertyPairNode, propertyValuePairToSelector } = sourceMetadata;

  rule?.nodes?.forEach((node: postcss.ChildNode) => {
    const declaration = node as postcss.Declaration;

    const propertyValuePair: PropertyValuePair = createPropertyValuePair(declaration);
    const selectorsForGivenPropertyPair: Array<string> | undefined = propertyValuePairToSelector.get(propertyValuePair);

    if (!selectorsForGivenPropertyPair) {
      return;
    }

    selectorsForGivenPropertyPair.forEach((selector: string) => {
      const propertyPairNode: Map<PropertyValuePair, postcss.Node | null> | undefined = selectorsToPropertyPairNode.get(selector);

      if (propertyPairNode?.has(propertyValuePair)) {
        propertyPairNode.set(propertyValuePair, node);
      } else {
        throw new Error("Property value should be in propertyPairNode");
      }
    });
  });
}
