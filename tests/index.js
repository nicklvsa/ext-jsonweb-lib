const ExtJSON = require('ext-json-lib');

const apiData = JSON.parse(`
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

const ext = new ExtJSON(apiData);
const data = ext.handleIncomingJSON(exampleData0, exampleData1);

console.log(data.content);