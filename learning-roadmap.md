Gulp
===
Streaming build server which we use for doing tasks like:
 * Compiling typescript, minifying the compiled gulpjs
 * Linting - I.e checking code for styleistic errors
 * Build the [typings]() definitions
 * Building the project as a whole
 * Test runner for our mocha tests
 * Starting a httpserver to serve a copy of the project on your dev machine

Brief introduction: http://gulpjs.com/
Deeper dive: [5 hour pluralsight course from John Papa](https://app.pluralsight.com/library/courses/javascript-build-automation-gulpjs/table-of-contents)

Node-js
=======
Let's us run JavaScript serverside.

We use node for tasks like:
  * Running our automated test suite
  * Hosting a local instance of the project for development and debugging
  * Gulp is installed as a node package

Brief introduction: [Collection of resources](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js)
Deeper dive: TBD

TypeScript
==========
A typed superset of JavaScript that compiles to plain JavaScript.

The reason the project is built on TypeScript instead of vanilla JavaScript is ???

Brief introduction: [The excellent Handbook at the TS docs](http://www.typescriptlang.org/docs/tutorial.html). Go through them all.
Deeper dive: TBD

Typings
-------
Typings is the simple way to manage and install TypeScript definitions.
It's like NuGet/npm for your TypeScript definitions

Brief introduction: [Github](https://github.com/typings/typings)
Deeper dive: TBD

Bower
=====
Package manager for front-end dependencies.
It's not in use now, but the PnP package will be available from Bower at release.
By using bower we can easily update and manage the packages the solution is built on.

Brief introduction: [Bower web](http://bower.io)
Deeper dive: TBD

Mocha and Chai
==============
JavaScript test framework running on Node.js and the browser.

Brief introduction: [The mocha website](http://mochajs.org/)
Deeper dive: TBD

Editors
=======
Development of PnP-JS-Core does not require Visual Studio.
Any text editor can be used. Of course Visual Studio and VS Code
has great built in support for TypeScript giving youthings like,a
  * Intellisense
  * Integration with TSLint