// REGISTER COMPONENTS ================================================================================================

var config = require('../../_config.json'),
    gulp = require('gulp'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat')
    ;

// END ================================================================================================================

// GULP TASKS [INSTALLS] ==============================================================================================

// A. UPDATE KONSTRUCT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('update-css', function() {

    // A.1. UPDATE KONSTRUCT VENDORS ----------------------------------------------------------------------------------
    
    for( vendor in config.core.konstructVendor) {
        gulp.src(['_bower.cache/' + config.core.konstructVendor[vendor] ])
        .pipe(gulp.dest('../' + config.siteSource + '/assets/css/konstruct/vendor').on('error', gutil.log));

    }
    
    // A.1. END -------------------------------------------------------------------------------------------------------

    // A.2. UPDATE KONSTRUCT BASE -------------------------------------------------------------------------------------
    
    for( base in config.core.konstructBase) {
        gulp.src(['_bower.cache/' + config.core.konstructBase[base] + '/*/**/*' ])
        .pipe(gulp.dest('../' + config.siteSource + '/assets/css/konstruct').on('error', gutil.log));

    }
    
    // A.2. END -------------------------------------------------------------------------------------------------------

    // A.3. UPDATE KONSTRUCT GLUE -------------------------------------------------------------------------------------
    
    gulp.src(['_bower.cache/konstruct.glue/stylesheet.scss' ])
    .pipe(gulp.dest('../' + config.siteSource + '/assets/css/').on('error', gutil.log));

    // A.3. END -------------------------------------------------------------------------------------------------------

});

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. INSTALL JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('install-js', function() {

    for( library in config.core.components) {
        gulp.src(['_bower.cache/' + config.core.components[library], ])
        .pipe(gulp.dest('../' + config.siteSource + '/assets/js/components/').on('error', gutil.log));
    }

});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// C. PREPARE JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('prepare-js', function() {
    
  gulp.src([
            '../' + config.siteSource + '/assets/js/components/modernizr.js',
            '../' + config.siteSource + '/assets/js/components/html5shiv.min.js',
            '../' + config.siteSource + '/assets/js/components/jquery.min.js',
            '../' + config.siteSource + '/assets/js/components/mobile-detect.min.js',
            '../' + config.siteSource + '/assets/js/components/angular.js',
            '../' + config.siteSource + '/assets/js/components/angular-animate.js',
            '../' + config.siteSource + '/assets/js/components/angular-ui-router.js',
            '../' + config.siteSource + '/assets/js/components/modernizr.js'
           ])
    .pipe(concat('components.js'))
    .pipe(gulp.dest('../' + config.siteSource + '/assets/js/'))
    gulp.src([
            '../' + config.siteSource + '/assets/js/components/*.*.map'
           ])
    .pipe(gulp.dest('../' + config.siteSource + '/assets/js/'))

});

// C. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================