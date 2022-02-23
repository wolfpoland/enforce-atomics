import * as postcss from "postcss";
import { createPropertyValuePair, PropertyValuePair } from "../../types/property-value-pair";
import { Selector } from "../../types/selector";

export function parseSourceAndSeedMataData(
  rule: postcss.Rule,
  selectorsToPropertyPairNode: Map<Selector, Map<PropertyValuePair, postcss.Node | null>>,
  propertyValuePairToSelector: Map<PropertyValuePair, Array<Selector>>
) {
  const propertyValuePairToNode: Map<PropertyValuePair, postcss.Node | null> = new Map<PropertyValuePair, postcss.Node | null>();

  if (!rule.selector.match("^[\\.]+([a-z]+[-]*[a-z]+[-]*)+$")) {
    return;
  }

  rule?.nodes?.forEach((node: postcss.ChildNode) => {
    const declaration = node as postcss.Declaration;

    const propertyValuePair: PropertyValuePair = createPropertyValuePair(declaration);

    const propertiesArr = propertyValuePairToSelector.get(propertyValuePair) || [];

    propertyValuePairToSelector.set(propertyValuePair, [...propertiesArr, rule.selector]);

    propertyValuePairToNode.set(propertyValuePair, null);
  });

  if (!parentIsMediaQuery(rule)) {
    selectorsToPropertyPairNode.set(rule.selector, new Map(propertyValuePairToNode));
  }
}

function parentIsMediaQuery(rule: postcss.Rule): boolean {
  return rule?.parent?.type === "atrule" && rule?.parent?.name === "media";
}
