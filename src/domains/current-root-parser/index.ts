import * as postcss from "postcss";
import { SourceMetadata } from "../source-parser/source-metadata";
import { parseSourceAndSeedMataData } from "../source-parser/parse-source-and-seed-mata-data";
import { parseRootAndSeedData } from "./parse-root-and-seed-data";
import { Selector } from "../../types/selector";

export function currentRootParser(root: postcss.Root, sourceMetadata: SourceMetadata) {
  root.walkRules((rule: postcss.Rule) => {
    parseRootAndSeedData(rule, sourceMetadata);
  });
}
