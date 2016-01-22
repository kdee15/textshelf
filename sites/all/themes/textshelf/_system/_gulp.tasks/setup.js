// REGISTER COMPONENTS ================================================================================================

var config = require('../_config.json'),
    gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat');

// END ================================================================================================================

// GULP TASKS [VARIABLES] ==============================================================================================

var PATH = "../" + config.root;

// END ================================================================================================================

// GULP TASKS [INSTALLS] ==============================================================================================

// A. INSTALL KONSTRUCT +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-css', function() {

    // A.1. INSTALL VENDOR LIBRARIES ----------------------------------------------------------------------------------

    for( vendor in config.assets.css.vendors) {
        
        gulp.src(['_bower.cache/' + config.assets.css.vendors[vendor] ])
        .pipe(gulp.dest(PATH + '/assets/css/konstruct/vendor').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.css.vendors[vendor]));

    }

    // A.1. END -------------------------------------------------------------------------------------------------------

    // A.2. INSTALL KONSTRUCT CORE ------------------------------------------------------------------------------------

    for( konstruct in config.assets.css.konstruct) {
        
        gulp.src(['_bower.cache/' + config.assets.css.konstruct[konstruct] + '/*/*' ])
        .pipe(gulp.dest(PATH + '/assets/css/konstruct').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.css.konstruct[konstruct]));

    }

    // A.2. END -------------------------------------------------------------------------------------------------------

    // A.4. INSTALL KONSTRUCT SITE ------------------------------------------------------------------------------------

    for( site in config.assets.css.site) {
        
        gulp.src(['_bower.cache/' + config.assets.css.site[site] + '/*/**/*' ])
        .pipe(gulp.dest(PATH + '/assets/css/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing site files.'));

    }

    // A.4. END -------------------------------------------------------------------------------------------------------

    // A.5. INSTALL KONSTRUCT GLUE ------------------------------------------------------------------------------------

    gulp.src([
                '_bower.cache/konstruct.glue/_config.scss',
                '_bower.cache/konstruct.glue/stylesheet.scss',
            ])
    .pipe(gulp.dest(PATH + '/assets/css/').on('error', gutil.log))
    gutil.log(gutil.colors.cyan('++ Installing site glue.'));

    // A.5. END -------------------------------------------------------------------------------------------------------

});

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. UPDATE KONSTRUCT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('update-css', function() {

    // B.1. INSTALL VENDOR LIBRARIES ----------------------------------------------------------------------------------

    for( vendor in config.assets.css.vendors) {
        
        gulp.src(['_bower.cache/' + config.assets.css.vendors[vendor] ])
        .pipe(gulp.dest(PATH + '/assets/css/konstruct/vendor').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Updating ' + config.assets.css.vendors[vendor]));

    }

    // B.1. END -------------------------------------------------------------------------------------------------------

    // B.2. INSTALL KONSTRUCT CORE ------------------------------------------------------------------------------------

    for( konstruct in config.assets.css.konstruct) {
        
        gulp.src(['_bower.cache/' + config.assets.css.konstruct[konstruct] + '/*/*' ])
        .pipe(gulp.dest(PATH + '/assets/css/konstruct').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Updating ' + config.assets.css.konstruct[konstruct]));

    }

    // B.2. END -------------------------------------------------------------------------------------------------------

});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// C. INSTALL JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-js', function() {
    
    // C.1. MOVE FILES FROM BOWER -------------------------------------------------------------------------------------

    for( bower in config.assets.js.bower) {

        gulp.src(['_bower.cache/' + config.assets.js.bower[bower], ])
        .pipe(gulp.dest(PATH + '/assets/js/components/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.js.bower[bower]));
    }
    
    // C.1. END -------------------------------------------------------------------------------------------------------
    
    // C.2. MOVE MAP FILES FROM BOWER ---------------------------------------------------------------------------------

    for( map in config.assets.js.maps) {

        gulp.src(['_bower.cache/' + config.assets.js.maps[map], ])
        .pipe(gulp.dest(PATH + '/assets/js/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Installing ' + config.assets.js.maps[map]));
    }
    
    // C.2. END -------------------------------------------------------------------------------------------------------

});

// C. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// D. COMPILE COMPONENTS INTO COMPONENTS.JS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('concat-js', function() {

    var files = [];
    
    for( component in config.assets.js.order) {

        files.push(PATH + '/assets/js/components/' + config.assets.js.order[component]);

    }
    
        
    gulp.src(files)
        .pipe(concat('components.js'))
        .pipe(gulp.dest(PATH + '/assets/js/').on('error', gutil.log))
        gutil.log(gutil.colors.cyan('++ Compiling components.js file '));


});

// D. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// E. INSTALL JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-angular-components', function() {

    gulp.src('_bower.cache/konstruct.angular/scripts/*')
    .pipe(gulp.dest(PATH + '/assets/js/scripts/').on('error', gutil.log))
    gutil.log(gutil.colors.cyan('++ Installing Angular components'));

});

// E. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================