import * as postcss from "postcss";

export type PropertyValuePair = string;

export function createPropertyValuePair(declaration: postcss.Declaration): PropertyValuePair {
  return `${declaration.prop}-${declaration.value}`;
}
