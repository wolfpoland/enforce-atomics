# enforce-atomics

Plugin for stylelint to enforcing usage of atomic classes from tailwind or external CSS file

#Instalation

npm i stylelint-plugin-enforce-atomics

or

yarn add stylelint-plugin-enforce-atomics

add entry in .stylelintrc.json

for example

{
  "extends": "stylelint-config-standard",
  "plugins": [
    "stylelint-plugin-enforce-atomics"
  ],
  "rules": {
    "plugin/enforce-atomics": true
  }
}


you can customize plugin by config: 

config [
  css: './externalFilePath.css' // Allows providing external css file [Default is tailwind dist file]
  propertiesWhitelist: ['display', 'width'] // Whitelist properties to report their atomic classes [Optional]
]
