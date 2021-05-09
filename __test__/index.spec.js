'use strict';

const {ruleName, messages} = require('../index');

const css = `
	test-fg-red {
		color: red;
		background: white;
	}

	test-fg-white {
	    background: black;
		color: white;
	}
	
	test-display-block {
		display: block;
	}
`;

testRule({
    plugins: ["./index.js"],
    ruleName,
    config: [true, {css}],

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
