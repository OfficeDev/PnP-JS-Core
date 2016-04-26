//******************************************************************************
//* copyRequireJsToSharePoint.js
//*
//* Defines a custom gulp task that copies the requirejs library
//* to an Office 365/SharePoint Online site specified in the custom 
//* settings.json file in the root of thie repository.
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    spsave = require("gulp-spsave");

//******************************************************************************
//* COPYREQUIREJSTOSHAREPOINT
//******************************************************************************

// use gulp-merge ?
gulp.task("copyRequireJsToSharePoint", function() {
    
    if (global.settings.siteUrl === "") {
        throw "A required custom 'settings.js' file is not present in root of this repository. Make a copy of settings.example.js, rename it as settings.js, and fill out the appropriate settings for your site.";
    }
    
    return gulp.src("./bower_components/requirejs/require.js")
        .pipe(spsave({
            username: global.settings.username,
            password: global.settings.password,
            siteUrl: global.settings.siteUrl,
            folder: "Style%20Library/pnp",
            checkin: true,
            checkinType: 1
        }));
});