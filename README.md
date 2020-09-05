# Ext JSON - Library

### Examples:

```javascript
const ExtJSON = require('ext-json-lib');

const apiJSON = JSON.parse(`
    {
        ">>example": "123",
        ">>test": "abc",
        ">>name": "Nick"
    }
`);

const userJSON1 = JSON.parse(`
    {
        "hello": "good afternoon {{name}}",
        "testing": "{{test}}, {{example}}"
    }
`);

const userJSON2 = JSON.parse(`
    {
        "pie": "lol",
        "cool": {
            "foo": "bar",
            "yo": "{{name}}"
        }
    }
`);

const ext = new ExtJSON.ExtJSON(apiJSON);

const response = ext.handleIncomingJSON(userJSON1, userJSON2);
console.log(response.content);
```