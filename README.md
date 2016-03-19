Parses input source code and modifies it, allowing you to use conventions that are accepted by the community, but go beyond what AngularJS itself brings with it.

Perfect for use with build tools such as Grunt or Gulp ([gulp-ng-conventions](https://github.com/seeekr/gulp-ng-conventions)).

The goal is to DRY up your code by making full use of conventions.

For now only supports adding `templateUrl` to directives that follow very simple, standard rules.

# Installation
```
npm install --save-dev ng-conventions
```

# Usage
```
import fs from 'fs'
import ngConventions from 'ng-conventions'
import path from 'path'

// assume we loaded the code below from this file
const FILE = 'componentA/mydirective.js'
const code = `
angular.module('myModule')
    .directive('myDirective', function () {
        return {
            compile () {
            }
        }
    })
`

const generated = ngConventions(FILE, content)
console.log(generated)
```

Outputs:

```
angular.module('myModule').directive('myDirective', function () {
    return {
        compile() {
        },
        templateUrl: 'componentA/myDirective.html'
    };
});
```

# Features

## Default templateUrl
If directive JS and HTML are in the same directory and the directive's template HTML is in a file named `${directiveName}.html`, `templateUrl` will be automatically set to that for you.
