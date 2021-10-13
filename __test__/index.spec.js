'use strict';

const {ruleName} = require('../index');

testRule({
    plugins: ["./index.js"],
    ruleName,
    config: [true, {css: 'projekty/enforce-atomics/__test__/test-file.css'}],

    accept: [
        {
            code: '.test-class { position: absolute; color: white; }'
        },
        {
            code: '.test-class { background: pink; }'
        }
    ],

    reject: [
        {
            code: '.test-class { color: red; } .test-class2 { color: white; background: black; display: flex;}',
            warnings: [
                {
                    message: 'Consider use of .test-fg-white (plugin/enforce-atomics)',
                    column: 58,
                    line: 1
                },
                {
                    message: 'Consider use of .test-fg-white (plugin/enforce-atomics)',
                    column: 44,
                    line: 1
                },
                {
                    column: 77,
                    line: 1,
                    message: "Consider use of .test-flex (plugin/enforce-atomics)"
                }
            ],
        },
        {
            code: '.test-class { position: absolute; color: white; display: block; }',
            message: 'Consider use of .test-display-block (plugin/enforce-atomics)'
        },
        {
            code: '.test-class { display: flex; }',
            message: 'Consider use of .test-flex (plugin/enforce-atomics)'
        }
    ],
});

testRule({
    plugins: ["./index.js"],
    ruleName,
    config: [true, {css: 'projekty/enforce-atomics/__test__/test-file.css', propertiesWhitelist: ['display', 'width']}],

    accept: [
        {
            code: '.test-class { position: absolute; color: white; background: black; }'
        }
    ],

    reject: [
        {
            code: '.test-class { position: absolute; color: white; display: block; background: black; }',
            message: 'Consider use of .test-display-block (plugin/enforce-atomics)'
        },
        {
            code: '.test-class { position: absolute; color: white; display: block; background: black; width: 100%;}',
            warnings: [
                {
                    message: 'Consider use of .test-display-block (plugin/enforce-atomics)',
                    column: 49,
                    line: 1
                },
                {
                    message: 'Consider use of .test-full-width (plugin/enforce-atomics)',
                    column: 84,
                    line: 1

                }
            ],
        }
    ],
});


