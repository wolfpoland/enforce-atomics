'use strict';

const path = require("path");
const postcss = require('postcss');
const stylelint = require('stylelint');
const fs = require('fs')
const ruleName = 'plugin/enforce-atomics';

const messages = stylelint.utils.ruleMessages(ruleName, {
    rejected: (atomicClass) => `Consider use of ${atomicClass.replace('\\32xl\\:', '')}`
});

module.exports = stylelint.createPlugin(
    ruleName,
    function rule(primary, options = {}) {
        return (root, result) => {
            let dirname = __dirname;
            let propertyWhitelistSet;


            if (!options.css) {
                options.css = 'node_modules/tailwindcss/dist/tailwind.css';
            } else {
                dirname = __dirname.split('/')
                const dirnameLength = dirname.length;
                dirname.length = dirnameLength - 2;
                dirname = dirname.join('/')
            }

            if (options.propertiesWhitelist) {
                propertyWhitelistSet = handlePropertyWhiteList();
            }

            const data = fs.readFileSync(path.resolve(dirname, options.css), 'utf8')
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
                reportWhenAtomicIsPresent(atomicsMap);
            }

            function seedMaps(statement, propertiesMap, selectorsMap) {
                const properties = new Map();
                const selectorMetaData = {length: statement.nodes.length, selector: statement.selector};

                if(!statement.selector.match('[.][a-z]+[-]')) {
                    return;
                }

                statement.nodes.forEach((node) => {
                    if (propertyWhitelistSet && (!propertyWhitelistSet.has(node.prop))) {
                        return;
                    }

                    const key = `${node.prop}-${node.value}`;

                    const propertiesArr = propertiesMap.get(key) ?? [];

                    propertiesMap.set(key, [
                        ...propertiesArr,
                        selectorMetaData
                    ]);
                    properties.set(key, false);
                });

                selectorsMap.set(statement.selector, properties);
            }

            function seedAtomicsMap(atomicsMap, statement) {
                statement.nodes.forEach((node) => {
                    const key = `${node.prop}-${node.value}`;
                    const propertiesContext = propertiesMap.get(key);

                    if (!propertiesContext) {
                        return;
                    }

                    propertiesContext.forEach((propertyContext) => {
                        const selectorName = propertyContext.selector;

                        if (!atomicsMap.has(selectorName)) {
                            const selectorContext = selectorsMap.get(propertyContext.selector);
                            atomicsMap.set(selectorName, new Map(selectorContext))
                        }

                        const atomic = atomicsMap.get(selectorName);
                        atomic.set(key, node);
                    })
                });
            }

            function reportWhenAtomicIsPresent(atomicsMap) {
                atomicsMap.forEach((value, key) => {
                    const propertyEntries = Array.from(value.values());

                    const isReportNecessary = propertyEntries.every((property) => !!property);

                    if (isReportNecessary) {
                        propertyEntries.forEach((property) => {
                            stylelint.utils.report({
                                message: messages.rejected(key),
                                node: property,
                                result,
                                ruleName
                            });
                        })
                    }

                });
            }

            function handlePropertyWhiteList() {
                const set = new Set();
                if (!Array.isArray(options.propertiesWhitelist)) {
                    throw new Error('propertiesWhitelist must be a array of strings!');
                }

                options.propertiesWhitelist.forEach((property) => {
                    if (typeof property !== "string") {
                        throw new Error(`propertiesWhitelist must be a array of strings! You provided ${typeof property}`);
                    }

                    set.add(property);
                });

                return set;
            }

            function checkPropertyWhitelist(prop) {
                for (const property of propertyWhitelistSet) {
                    const includesIndex = property.indexOf('-*');
                    const whitelistedProperty = property.replace('-*', '')
                    if (includesIndex !== -1) {
                        return prop.include(whitelistedProperty)
                    } else {
                        return property === prop;
                    }
                }
            }
        };
    });

module.exports.ruleName = ruleName;
module.exports.messages = messages;

