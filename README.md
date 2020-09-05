# Ext JSON - Library

### Examples:

```javascript
const ExtJSON = require('ext-json-lib');

// example json - usually some definitions
const apiJSON = JSON.parse(`
    {
        ">>example": "123",
        ">>test": "abc",
        ">>name": "Nick"
    }
`);

// example json
const userJSON1 = JSON.parse(`
    {
        "hello": "good afternoon {{name}}",
        "testing": "{{test}}, {{example}}"
    }
`);

// example json
const userJSON2 = JSON.parse(`
    {
        "pie": "lol",
        "cool": {
            "foo": "bar",
            "yo": "{{name}}"
        }
    }
`);

// initialize the new ExtJSON class
const ext = new ExtJSON(apiJSON);

// handle the json
const response = ext.handleIncomingJSON(userJSON1, userJSON2);
console.log(response.content);
```