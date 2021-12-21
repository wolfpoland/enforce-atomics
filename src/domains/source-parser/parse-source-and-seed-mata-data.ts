import * as postcss from "postcss";
import { createPropertyValuePair, PropertyValuePair } from "../../types/property-value-pair";
import { Selector } from "../../types/selector";

export function parseSourceAndSeedMataData(
  rule: postcss.Rule,
  selectorsToPropertyPairNode: Map<Selector, Map<PropertyValuePair, postcss.Node | null>>, // bez sensu
  propertyValuePairToSelector: Map<PropertyValuePair, Array<Selector>>
) {
  const propertyValuePairToNode: Map<PropertyValuePair, postcss.Node | null> = new Map<PropertyValuePair, postcss.Node | null>();

  if (!rule.selector.match("^[\\.]+([a-z]+[-]+[a-z]+[-]*)+$")) {
    return;
  }

  rule?.nodes?.forEach((node: postcss.ChildNode) => {
    const declaration = node as postcss.Declaration;

    const propertyValuePair: PropertyValuePair = createPropertyValuePair(declaration);

    const propertiesArr = propertyValuePairToSelector.get(propertyValuePair) || [];

    propertyValuePairToSelector.set(propertyValuePair, [...propertiesArr, rule.selector]);

    propertyValuePairToNode.set(propertyValuePair, null); // to bez sesnu
  });

  selectorsToPropertyPairNode.set(rule.selector, propertyValuePairToNode); // to pewnie tez
}
