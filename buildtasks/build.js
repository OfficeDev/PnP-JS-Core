//******************************************************************************
//* build.js
//*
//* Defines a custom gulp task for compiling TypeScript source code into
//* js files.  It outputs the details as to what it generated to the console.
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    replace = require('gulp-replace');

//******************************************************************************
//* BUILD
//******************************************************************************
gulp.task("build", ["lint", "build-typings", "clean"], function () {
    var src = global.TSWorkspace.Files.slice(0);
    src.push(global.TSTypings.Main);

    return gulp.src(src)
        .pipe(tsc(global.tsProject))
        .js.pipe(replace(/(\(function \(factory\) {)/g, '$1/* istanbul ignore next */'))
        .pipe(gulp.dest(global.TSCompiledOutput.RootFolder));
});
