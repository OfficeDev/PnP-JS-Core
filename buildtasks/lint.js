//******************************************************************************
//* lint.js
//*
//* Defines a custom gulp task for ensuring that all source code in
//* this repository follows recommended TypeScript practices. 
//*
//* Rule violations are output automatically to the console.
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    tslint = require("gulp-tslint");

//******************************************************************************
//* LINT
//******************************************************************************

gulp.task("lint", function () {
    return gulp.src(global.TSWorkspace.TSLint)
        .pipe(tslint({
            formatter: "prose"
        }))
        .pipe(tslint.report({
            emitError: false
        }));
});