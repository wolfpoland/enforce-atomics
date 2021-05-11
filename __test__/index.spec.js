'use strict';

const {ruleName} = require('../index');

testRule({
    plugins: ["./index.js"],
    ruleName,
    config: [true, {css: '__test__/test-file.css'}],

    accept: [
        {
            code: '.test-class { position: absolute; color: white; display: flex }'
        }
    ],

    reject: [
        // {
        //     code: '.test-class { color: red; } .test-class2 { color: white; background: black; }',
        //     message: '[{"column": 58, "line": 1, "rule": "plugin/enforce-atomics", "severity": "error", "text": "Consider use of test-fg-white (plugin/enforce-atomics)"}, {"column": 44, "line": 1, "rule": "plugin/enforce-atomics", "severity": "error", "text": "Consider use of test-fg-white (plugin/enforce-atomics)"}]'
        // },
        {
            code: '.test-class { position: absolute; color: white; display: block; }',
            message: 'Consider use of test-display-block (plugin/enforce-atomics)'
        }
    ],
});

testRule({
    plugins: ["./index.js"],
    ruleName,
    config: [true, {css: ''}],

    reject: [
        {
            code: '.test-class { width:100% }',
            message: 'Consider use of .w-full (plugin/enforce-atomics)'
        }
    ]
});

