"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    gutil = require('gulp-util'),
    print = require('gulp-print'),
    src = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    srcmaps = require("gulp-sourcemaps"),
    header = require('gulp-header'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul"),

    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),

    browserSync = require('browser-sync').create(),
    browserify = require("browserify"),
    uglify = require("gulp-uglify")

//******************************************************************************
//* GLOBAL VARIABLES
//******************************************************************************

var TSTypings = {
    "RootFolder": 'typings',
    "Main": 'typings/main.d.ts',
    "PnPRootFolder": 'typings/pnp',
    "PnPFiles": [
        'typings/pnp/*.d.ts',
        'typings/pnp/**/*.d.ts'
    ]
};

var TSCompiledOutput = {
    "RootFolder": 'lib',
    "JSCodeFiles": [
        'lib/*.js',
        'lib/**/*.js',
        '!lib/*.test.js',
        '!lib/**/*.test.js',
    ],
    "JSTestFiles": [
        'lib/*.test.js',
        'lib/**/*.test.js',
    ],
};

var TSWorkspace = {
    "RootFolder": 'src',
    "PnPFile": "src/pnp.ts",
    "Files": [
        'src/*.ts',
        'src/**/*.ts',
    ]
}

var TSDist = {
    "RootFolder": 'dist',
    "BundleFileName": "pnp.js",
    "MinifyFileName": "pnp.min.js",
    "DefinitionFileName": "pnp.d.ts"
}

var PnPLocalServer = {
    "RootFolder": 'server-root',
    "ScriptsRootFolder": 'scripts'
}

var tsProject = tsc.createProject("tsconfig.json");
var pkg = require("./package.json");

var banner = [
    "/**",
    " * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright (c) 2016 <%= pkg.author.name %>",
    " * <%= pkg.license %>",
    " */", ""
].join("\n");

//******************************************************************************
//* LINT
//******************************************************************************

gulp.task("lint", function() {
    return gulp.src(TSWorkspace.Files)
        .pipe(tslint({}))
        .pipe(tslint.report("verbose"));
});

//******************************************************************************
//* BUILD, placing files in compiled - used when testing
//******************************************************************************

gulp.task('clean', function() {
    var directories = [];
    directories.push(TSCompiledOutput.RootFolder);
    directories.push(PnPLocalServer.RootFolder + "/" + PnPLocalServer.ScriptsRootFolder);

    return gulp.src(directories, { read: false })
        .pipe(clean());
});

gulp.task("build-typings", function() {
    var src = TSWorkspace.Files;
    src.push(TSTypings.Main);
    src.push("!src/*.test.ts");
    src.push("!src/**/*.test.ts");
    
    // create a project specific to our typings build and specify the outFile. This will result
    // in a single pnp.d.ts file being creating and piped to the typings folder
    var typingsProject = tsc.createProject('tsconfig.json', { declaration: true });

    return gulp.src(src)
        .pipe(tsc(typingsProject))
        .dts.pipe(gulp.dest(TSCompiledOutput.RootFolder));
});

gulp.task("build", ["lint", "build-typings", "clean"], function() {
    var src = TSWorkspace.Files;
    src.push(TSTypings.Main);

    return gulp.src(src)
        .pipe(tsc(tsProject))
        .js.pipe(replace(/(\(function \(factory\) {)/g, '$1/* istanbul ignore next */'))
        .pipe(gulp.dest(TSCompiledOutput.RootFolder))
        .pipe(print());
});

//******************************************************************************
//* BUILD DIST FOLDER
//******************************************************************************

function packageDefinitions() {

    console.log(TSDist.RootFolder + "/" + TSDist.DefinitionFileName);

    var src = TSWorkspace.Files;
    src.push(TSTypings.Main);
    src.push("!src/*.test.ts");
    
    // create a project specific to our typings build and specify the outFile. This will result
    // in a single pnp.d.ts file being creating and piped to the typings folder
    var typingsProject = tsc.createProject('tsconfig.json', { declaration: true, outFile: "pnp.js" });

    return gulp.src(src)
        .pipe(tsc(typingsProject))
        .dts.pipe(gulp.dest(TSDist.RootFolder));
}

function packageBundle() {

    console.log(TSDist.RootFolder + "/" + TSDist.BundleFileName);

    return browserify('./lib/pnp.js', {
        debug: false,
        standalone: '$pnp',
        external: ["es6-promise", "jquery", "whatwg-fetch", "node-fetch"]
    }).ignore('*.d.ts').bundle()
        .pipe(src(TSDist.BundleFileName))
        .pipe(buffer())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(TSDist.RootFolder));
}

function packageBundleUglify() {

    console.log(TSDist.RootFolder + "/" + TSDist.MinifyFileName);
    console.log(TSDist.RootFolder + "/" + TSDist.MinifyFileName + ".map");

    return browserify('./lib/pnp.js', {
        debug: false,
        standalone: '$pnp',
        external: ["es6-promise", "jquery", "whatwg-fetch", "node-fetch"]
    }).ignore('*.d.ts').bundle()
        .pipe(src(TSDist.MinifyFileName))
        .pipe(buffer())
        .pipe(srcmaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(srcmaps.write('./'))
        .pipe(gulp.dest(TSDist.RootFolder))
}

gulp.task("package", ["build"], function() {
    packageDefinitions();
    packageBundle();
    packageBundleUglify();
});

//******************************************************************************
//* TEST
//******************************************************************************

gulp.task("istanbul:hook", ["build"], function() {
    return gulp.src(TSCompiledOutput.JSCodeFiles)
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["build", "istanbul:hook"], function() {
    return gulp.src(TSCompiledOutput.JSTestFiles)
        .pipe(mocha({ ui: 'bdd', reporter: 'dot' }))
        .pipe(istanbul.writeReports());
});

//******************************************************************************
//* BUILD & COPY THE OUTPUT IN THE "SERVER-ROOT/SCRIPTS" FOLDER
//******************************************************************************

function setBrowserSync(buildServeTaskName) {
    browserSync.init({
        server: PnPLocalServer.RootFolder
    });

    gulp.watch(TSWorkspace.Files, ["lint", buildServeTaskName]);
    gulp.watch(PnPLocalServer.RootFolder).on('change', browserSync.reload);
    gulp.watch(PnPLocalServer.RootFolder + "/" + PnPLocalServer.ScriptsRootFolder + "/**.js").on('change', browserSync.reload);
    gulp.watch(PnPLocalServer.RootFolder + "/" + PnPLocalServer.ScriptsRootFolder + "/**/**.js").on('change', browserSync.reload);
}

// DIST SERVE (BUNDLE WITH SOURCE MAP)

gulp.task("build-serve-dist", ["package"], function() {
    var distFiles = TSDist.RootFolder + "/*.{js,map}"

    return gulp.src(distFiles)
        .pipe(gulp.dest(PnPLocalServer.RootFolder + "/" + PnPLocalServer.ScriptsRootFolder));
});

gulp.task("serve", ["build-serve-dist"], function() {
    setBrowserSync("build-serve-dist");
});

//******************************************************************************
//* DEFAULT
//******************************************************************************

gulp.task("default", function(cb) {
    runSequence("lint", "build", "test", cb);
});

//******************************************************************************
//* DEPLOY TO O365
//* Requires settings.js - see settings.example.js
//******************************************************************************

var settings, 
    spsave;

gulp.task('configureSPSave', function() {
    
    try {
        settings = require("./settinsgs.js");
    } catch (error) {
        throw new gutil.PluginError(
            'configureSPSave', 
            'Settings file is missing or invalid, please refer to https://github.com/OfficeDev/PnP-JS-Core/blob/master/docs/configuring-spsave.md for how to configure spsave');
    }
    
    spsave = require("gulp-spsave");
    
});

// use gulp-merge ?
gulp.task("copyRequireJsToSharePoint", function() {
    return gulp.src("./bower_components/requirejs/require.js")
    .pipe(spsave({
        username: settings.username,
        password: settings.password,
        siteUrl: settings.siteUrl,
        folder: "Style%20Library/pnp"
    }));
});

gulp.task("copyJsToSharePoint", ["configureSPSave", "lint", "package", "copyRequireJsToSharePoint"], function(){
    return gulp.src("./dist/*.js")
        .pipe(spsave({
            username: settings.username,
            password: settings.password,
            siteUrl: settings.siteUrl,
            folder: "Style%20Library/pnp"
        }));
});
