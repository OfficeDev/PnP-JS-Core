//******************************************************************************
//* serve.js
//*
//* Defines a custom gulp task for serving up content from the server-root 
//* local folder, setup file/folder watchers so that changes are reflected
//* on file save, and open the default browser to the default html page. 
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    browserSync = require('browser-sync').create();

function setBrowserSync(buildServeTaskName) {
    browserSync.init({
        server: global.PnPLocalServer.RootFolder,
        https: true
    });

    gulp.watch(global.TSWorkspace.Files, ["lint", buildServeTaskName]);
    gulp.watch(global.PnPLocalServer.RootFolder).on('change', browserSync.reload);
    gulp.watch(global.PnPLocalServer.RootFolder + "/" +  global.PnPLocalServer.ScriptsRootFolder + "/**/*.js").on('change', browserSync.reload);
}

//******************************************************************************
//* SERVE
//******************************************************************************

gulp.task("serve", ["build-serve-dist"], function() {
    setBrowserSync("build-serve-dist");
});