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
    print = require('gulp-print'),
    replace = require('gulp-replace');

//******************************************************************************
//* BUILD
//******************************************************************************
gulp.task("build", ["lint", "build-typings", "clean"], function () {
    var src = global.TSWorkspace.Files.slice(0);
    src.push(global.TSTypings.Main);

//        .js.pipe(replace(/(\(function \(factory\) {)/g, '$1/* istanbul ignore next */'))

    return gulp.src(src)
        .pipe(tsc(global.tsProject))
        .pipe(gulp.dest(global.TSCompiledOutput.RootFolder))
        .pipe(print());
});

