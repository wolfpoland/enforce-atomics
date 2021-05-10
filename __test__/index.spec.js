'use strict';

const {ruleName, messages} = require('../index');

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
        {
            code: '.test-class { color: red; } .test-class2 { color: white; background: black; }',
            message: `${messages.rejected} test-fg-white`
        },
        {
            code: '.test-class { position: absolute; color: white; display: block; }',
            message: `${messages.rejected} test-display-block`
        }
    ],
});
