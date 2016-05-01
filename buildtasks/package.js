//******************************************************************************
//* package.js
//*
//* Defines a custom gulp task for creating core.js, core.min.js,
//* provisioning.js, provisioning.min.js
//* and pnp/provisioning.min.js.map in the dist folder
//******************************************************************************

"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    browserify = require("browserify"),
    uglify = require("gulp-uglify"),
    src = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    header = require('gulp-header'),
    srcmaps = require("gulp-sourcemaps"),
    merge = require("merge2");

// we need to build src (es5, umd) -> build
// we need to package the definitions in a single file -> dist
// we need to build src (es6, es6) -> lib
// we need to browsify build/src -> dist
// we need to browsify & uglify build/src -> dist

function packageDefinitions(file) {

    console.log(global.TSDist.RootFolder + "/" + file + ".d.ts");

    var src = global.TSWorkspace.Files.slice(0);
    src.push(global.TSTypings.Main);

    // create a project specific to our typings build and specify the outFile. This will result
    // in a single pnp.d.ts file being creating and piped to the typings folder
    var typingsProject = tsc.createProject('tsconfig.json', { "declaration": true, "outFile": file + ".js" });

    return gulp.src(src)
        .pipe(tsc(typingsProject))
        .dts.pipe(gulp.dest(global.TSDist.RootFolder));
}

function packageLib() {

    var src = global.TSWorkspace.Files.slice(0);
    src.push("./typings/main/ambient/sharepoint/index.d.ts");
    src.push("./typings/main/ambient/whatwg-fetch/index.d.ts");
    src.push("./typings/main/ambient/microsoft.ajax/index.d.ts");
    src.push("./typings/main/ambient/jquery/index.d.ts");

    // setup our es6 project
    var packageProject = tsc.createProject({
        "declaration": true,
        "removeComments": false,
        "module": "es6",
        "target": "es6",
        "jsx": "react"
    });

    var built = gulp.src(src).pipe(tsc(packageProject));

    return merge([
        built.dts.pipe(gulp.dest(global.TSDist.SrcFolder)),
        built.js.pipe(gulp.dest(global.TSDist.SrcFolder)),
    ]);
}

function packageBundle(file) {

    console.log(global.TSDist.RootFolder + "/" + file + ".js");

    return browserify('./build/src/' + file + ".js", {
        debug: false,
        standalone: '$pnp',
        external: ["es6-promise", "jquery", "whatwg-fetch", "node-fetch"]
    }).ignore('*.d.ts').bundle()
        .pipe(src(file + ".js"))
        .pipe(buffer())
        .pipe(header(banner, { pkg: global.pkg }))
        .pipe(gulp.dest(global.TSDist.RootFolder));
}

function packageBundleUglify(file) {

    console.log(global.TSDist.RootFolder + "/" + file + ".min.js");
    console.log(global.TSDist.RootFolder + "/" + file + ".min.js" + ".map");

    return browserify('./build/src/' + file + '.js', {
        debug: false,
        standalone: '$pnp',
        external: ["es6-promise", "jquery", "whatwg-fetch", "node-fetch"]
    }).ignore('*.d.ts').bundle()
        .pipe(src(file + ".min"))
        .pipe(buffer())
        .pipe(srcmaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(header(banner, { pkg: global.pkg }))
        .pipe(srcmaps.write('./'))
        .pipe(gulp.dest(global.TSDist.RootFolder));
}

//******************************************************************************
//* PACKAGE
//******************************************************************************
gulp.task("package", ["build", "test"], function () {
    packageDefinitions("core");
    packageLib();
    packageBundle("core");
    packageBundleUglify("core");

    packageDefinitions("provisioning");
    packageLib();
    packageBundle("provisioning");
    packageBundleUglify("provisioning");
});
