# cgi-body-parser

parses a request body into an object

## Quick Examples

```javascript
// assume data: d = [ 1, 2, 3 ], will be d%5B%5D=1&d%5B%5D=2&d%5B%5D=3 
// after sending form
cgi-body-parser.parse("d%5B%5D=1&d%5B%5D=2&d%5B%5D=3")
// this will return { d: [ 1, 2, 3 ]}
```