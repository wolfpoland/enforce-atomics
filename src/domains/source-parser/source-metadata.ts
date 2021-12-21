import { Selector } from "../../types/selector";
import { PropertyValuePair } from "../../types/property-value-pair";
import * as postcss from "postcss";

export class SourceMetadata {
  constructor(
    public readonly selectorsToPropertyPairNode: Map<Selector, Map<PropertyValuePair, postcss.Node | null>>,
    public readonly propertyValuePairToSelector: Map<PropertyValuePair, Array<Selector>>
  ) {}
}
