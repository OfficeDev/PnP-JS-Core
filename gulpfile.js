"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var tsc = require("gulp-typescript");

//******************************************************************************
//* GLOBAL VARIABLES
//******************************************************************************

global.TSTypings = {
    "Main": 'typings/index.d.ts'
};

global.TSCompiledOutput = {
    "RootFolder": 'build/src',
    "TestRootFolder": 'build/tests',
    "JSCodeFiles": [
        'build/**/*.js',
        '!build/**/*.test.js'
    ],
    "JSTestFiles": [
        'build/**/*.test.js',
    ],
};

global.TSWorkspace = {
    "RootFolder": 'src',
    "PnPFile": "src/pnp.ts",
    "Files": [
        'src/**/*.ts',
    ],
    "Tests": [
        'tests/**/*.ts',
    ]
};

global.TSDist = {
    "RootFolder": 'dist',
    "SrcFolder": "lib",
    "BundleFileName": "pnp.js",
    "MinifyFileName": "pnp.min.js",
    "DefinitionFileName": "pnp.d.ts"
};

global.PnPLocalServer = {
    "RootFolder": 'server-root',
    "ScriptsRootFolder": 'scripts'
};

global.tsProject = tsc.createProject("tsconfig.json");

global.pkg = require("./package.json");

global.banner = [
    "/**",
    " * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright (c) 2016 Microsoft",
    " * <%= pkg.license %>",
    " */", ""
].join("\n");

// make gulpfile.js not error out if settings.js is not present
try {
    global.settings = require("./settings.js");
} catch (e) {
    global.settings = {username: "", password: "", siteUrl: "", folder: ""};
}

//******************************************************************************
//* INCLUDE BUILDTASK DEFINTIONS
//******************************************************************************

require("./buildtasks/build.js");
require("./buildtasks/build-serve-dist.js");
require("./buildtasks/build-typings.js");
require("./buildtasks/clean.js");
require("./buildtasks/copyJsToSharePoint.js");
require("./buildtasks/copyRequireJsToSharePoint.js");
require("./buildtasks/default.js");
require("./buildtasks/istanbul-hook.js");
require("./buildtasks/lint.js");
require("./buildtasks/package.js");
require("./buildtasks/serve.js");
require("./buildtasks/sync.js");
require("./buildtasks/test.js");
