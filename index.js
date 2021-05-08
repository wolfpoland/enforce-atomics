'use strict';

const postcss = require('postcss');
const stylelint = require('stylelint');

const ruleName = 'plugin/enforce-atomics';
const separator = '-__-'

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

        const rootCss = postcss.parse(options.css);

        const resMap = buildMap(rootCss);

        root.walkRules(checkAtomics);


        function buildMap(rootCssProp) {
            const map = new Map();

            rootCssProp.walkRules(processSelector);

            function processSelector(statement) {

                const key = creteKey(statement);

                map.set(key, statement.selector);
            }

            return map;
        }

        function checkAtomics(statement) {

            const key = creteKey(statement);
            const res = resMap.get(key);


            if (res) {
                stylelint.utils.report({
                    message: `${messages.rejected} ${key}`,
                    node: statement,
                    result,
                    ruleName
                });
            }
        }

        function creteKey(statement) {
            const selectorProperties = [];

            statement.nodes.forEach((node) => {
                selectorProperties.push(`${node.prop}-${node.value}`)
            });

            selectorProperties.sort();

            return selectorProperties.join(separator);
        }
    };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;

