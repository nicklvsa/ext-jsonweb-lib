# Ext JSON - Library

### Examples:

```javascript
const ExtJSON = require('ext-json-lib');

const baseData = JSON.parse(`
    {
        ">>first_name": "Nick",
        ">>last_name": "Nicklvsa",
        ">>age": "18"
    }
`);

const exampleData0 = JSON.parse(`
    {
        "user": {
            "name": "Mr. {{first_name}} {{last_name}}",
            "age": "{{age}} years old",
            "str": "{{user.name}} is {{user.age}}"
        },
        "hello": "world",
        "foo": "bar"
    }
`);

const exampleData1 = JSON.parse(`
    {
        "example0": "Hello {{user.name}}",
        "example1": "Testing: {{user.str}}"
    }
`);

// First argument of `handleIncomingJSON` is able to represent some base object

const data = ExtJSON.handleIncomingJSON(baseData, exampleData0, exampleData1);
// or: 
// const data = ExtJSON.handleIncomingJSON({}, baseData, exampleData0, exampleData1);
console.log(data.content);
```