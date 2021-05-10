'use strict';

const postcss = require('postcss');
const stylelint = require('stylelint');
const fs = require('fs')
const ruleName = 'plugin/enforce-atomics';

const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: 'Consider use of '
});

module.exports = stylelint.createPlugin(
    ruleName,
    function rule(primary, options = {}) {
        return (root, result) => {
            if (!options.css) {
                return;
            }

            const data = fs.readFileSync(options.css, 'utf8')
            const rootCss = postcss.parse(data);

            const {propertiesMap, selectorsMap} = buildMap(rootCss);

            root.walkRules(checkAtomics);


            function buildMap(rootCssProp) {
                const propertiesMap = new Map();
                const selectorsMap = new Map();

                rootCssProp.walkRules(processSelector);

                function processSelector(statement) {
                    seedMaps(statement, propertiesMap, selectorsMap);
                }

                return {propertiesMap, selectorsMap};
            }

            function checkAtomics(statement) {
                const atomicsMap = new Map();
                seedAtomicsMap(atomicsMap, statement);
                reportWhenAtomicIsPresent(atomicsMap, statement);
            }

            function seedMaps(statement, propertiesMap, selectorsMap) {
                const properties = new Map();
                const selectorMetaData = {length: statement.nodes.length, selector: statement.selector};

                statement.nodes.forEach((node) => {
                    const key = `${node.prop}-${node.value}`;
                    propertiesMap.set(key, selectorMetaData);
                    properties.set(key, false);
                });

                selectorsMap.set(statement.selector, properties);
            }

            function seedAtomicsMap(atomicsMap, statement) {
                statement.nodes.forEach((node) => {
                    const key = `${node.prop}-${node.value}`;
                    const propertyContext = propertiesMap.get(key);
                    if (!propertyContext) {
                        return;
                    }

                    const selectorName = propertyContext.selector;

                    if (!atomicsMap.has(selectorName)) {
                        const selectorContext = selectorsMap.get(propertyContext.selector);
                        atomicsMap.set(selectorName, new Map(selectorContext))
                    }

                    const atomic = atomicsMap.get(selectorName);
                    atomic.set(key, true);
                });
            }

            function reportWhenAtomicIsPresent(atomicsMap, statement) {
                atomicsMap.forEach((value, key) => {
                    const propertyEntries = Array.from(value.values());

                    const isReportNecessary = propertyEntries.every((property) => !!property);

                    if(isReportNecessary) {
                        stylelint.utils.report({
                            message: `${messages.rejected} ${key}`,
                            node: statement,
                            result,
                            ruleName
                        });
                    }

                });
            }
        };
    });

module.exports.ruleName = ruleName;
module.exports.messages = messages;

