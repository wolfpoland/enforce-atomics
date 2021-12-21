import * as fs from "fs";
import * as path from "path";
import * as postcss from "postcss";

import { parseSourceAndSeedMataData } from "./parse-source-and-seed-mata-data";
import { Selector } from "../../types/selector";
import { PropertyValuePair } from "../../types/property-value-pair";
import { SourceMetadata } from "./source-metadata";

export function sourceParser(cssSourcePath: string): SourceMetadata {
  const data = fs.readFileSync(path.resolve(cssSourcePath), "utf8");
  const rootCss: postcss.Root = postcss.parse(data);

  const selectorsToPropertyPairNode: Map<Selector, Map<PropertyValuePair, postcss.Node | null>> = new Map<
    Selector,
    Map<PropertyValuePair, postcss.Node | null>
  >();
  const propertyValuePairToSelector: Map<PropertyValuePair, Array<Selector>> = new Map<PropertyValuePair, Array<Selector>>();

  rootCss.walkRules((rule: postcss.Rule) => {
    parseSourceAndSeedMataData(rule, selectorsToPropertyPairNode, propertyValuePairToSelector);
  });

  return new SourceMetadata(selectorsToPropertyPairNode, propertyValuePairToSelector);
}
