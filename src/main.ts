import * as fs from "fs";
import * as path from "path";

import { createPlugin, utils } from "stylelint";
import { config } from "./config";
import { PluginOption } from "./types/PluginOption";
import * as postcss from "postcss";
import { Util } from "./util";

export const messages = utils.ruleMessages(config.ruleName, {
  rejected: (atomicClass) =>
    `Consider use of ${atomicClass.replace("\\32xl\\:", "")}`,
});

export function run(): Function {
  return createPlugin(
    config.ruleName,
    function rule(_: any, options: object | null = null) {
      return (root: postcss.Root, result: postcss.Result) => {
        // @TODO: Refactor looks stupid
        const pathToFile: string = Util.removeLastSegmentsFromPath(
          __dirname,
          3
        );
        const { css, propertiesWhitelist }: PluginOption =
          options as PluginOption;

        let propertyWhitelistSet: Set<string>;

        if (!options) {
          return;
        }

        if (!css) {
          throw new Error("Css option property must be set!");
        }

        if (propertiesWhitelist) {
          propertyWhitelistSet = handlePropertyWhiteList(propertiesWhitelist);
        }

        const data = fs.readFileSync(path.resolve(pathToFile, css), "utf8");
        const rootCss: postcss.Root = postcss.parse(data);

        const { propertiesMap, selectorsMap } = buildMap(rootCss);

        root.walkRules(checkAtomics);

        function buildMap(rootCssProp: postcss.Root) {
          const propertiesMap = new Map();
          const selectorsMap: Map<string, any> = new Map();

          rootCssProp.walkRules(processSelector);

          function processSelector(statement: postcss.Rule) {
            seedMaps(statement, propertiesMap, selectorsMap);
          }

          return { propertiesMap, selectorsMap };
        }

        function checkAtomics(rule: postcss.Rule) {
          const atomicsMap: Map<string, any> = new Map();
          seedAtomicsMap(atomicsMap, rule);
          reportWhenAtomicIsPresent(atomicsMap);
        }

        function seedMaps(
          statement: postcss.Rule,
          propertiesMap: Map<string, Array<any>>,
          selectorsMap: Map<string, any>
        ) {
          const properties = new Map();

          const selectorMetaData = {
            length: statement?.nodes?.length,
            selector: statement.selector,
          };

          if (!statement.selector.match("^[\\.]+([a-z]+[-]+[a-z]+[-]*)+$")) {
            return;
          }

          statement?.nodes?.forEach((node: postcss.ChildNode) => {
            const declaration = node as postcss.Declaration;

            if (
              propertyWhitelistSet &&
              !propertyWhitelistSet.has(declaration.prop)
            ) {
              return;
            }

            const key = `${declaration.prop}-${declaration.value}`;

            const propertiesArr = propertiesMap.get(key) || [];

            propertiesMap.set(key, [...propertiesArr, selectorMetaData]);
            properties.set(key, false);
          });

          selectorsMap.set(statement.selector, properties);
        }

        function seedAtomicsMap(
          atomicsMap: Map<string, Map<string, any>>,
          rule: postcss.Rule
        ) {
          rule?.nodes?.forEach((node: postcss.ChildNode) => {
            const declaration = node as postcss.Declaration;

            const key = `${declaration.prop}-${declaration.value}`;
            const propertiesContext = propertiesMap.get(key);

            if (!propertiesContext) {
              return;
            }

            propertiesContext.forEach((propertyContext: any) => {
              const selectorName = propertyContext.selector;

              if (!atomicsMap.has(selectorName)) {
                const selectorContext = selectorsMap.get(
                  propertyContext.selector
                );
                atomicsMap.set(selectorName, new Map(selectorContext));
              }

              const atomic = atomicsMap.get(selectorName);
              atomic?.set(key, node);
            });
          });
        }

        function reportWhenAtomicIsPresent(
          atomicsMap: Map<string, Map<string, any>>
        ) {
          atomicsMap.forEach((value: Map<string, any>, key: string) => {
            const propertyEntries = Array.from(value.values());

            const isReportNecessary = propertyEntries.every(
              (property) => !!property
            );

            if (isReportNecessary) {
              propertyEntries.forEach((property) => {
                utils.report({
                  message: messages.rejected(key),
                  node: property,
                  result,
                  ruleName: config.ruleName,
                });
              });
            }
          });
        }

        function handlePropertyWhiteList(
          propertiesWhitelist: Array<string>
        ): Set<string> {
          const set = new Set<string>();
          if (!Array.isArray(propertiesWhitelist)) {
            throw new Error("propertiesWhitelist must be a array of strings!");
          }

          propertiesWhitelist.forEach((property) => {
            if (typeof property !== "string") {
              throw new Error(
                `propertiesWhitelist must be a array of strings! You provided ${typeof property}`
              );
            }

            set.add(property);
          });

          return set;
        }
      };
    }
  );
}
