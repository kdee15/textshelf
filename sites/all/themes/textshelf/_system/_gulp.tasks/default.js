 // REGISTER COMPONENTS ================================================================================================

var config = require('../_config.json'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish')
    ;

// END ================================================================================================================

// GULP TASK [SERVER + LIVERELOAD] ====================================================================================

// A. VARIABLES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var EXPRESS_PORT = 4200;
var ROOT = '../' + config.root;
var LIVERELOAD_PORT = 35729;

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. Individual task +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B.1. SERVER --------------------------------------------------------------------------------------------------------

function startExpress() {

    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(ROOT));
    app.listen(EXPRESS_PORT);

    console.log();
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log();
    console.log('Server is running at: http://localhost:' + EXPRESS_PORT);
    console.log();
    console.log('You can stop the server at any time by pressing CTRL + C');
    console.log();
    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log();

}

// B.1. END -----------------------------------------------------------------------------------------------------------

// B.2. LIVERELOAD ----------------------------------------------------------------------------------------------------

var lr;
function startLivereload() {

    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);

}

// B.2. END -----------------------------------------------------------------------------------------------------------

// B.3. NOTIFY CHANGES ------------------------------------------------------------------------------------------------

function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(ROOT, event.path);
    console.log('');
    console.log('+++ You changed: ' + fileName );
    console.log('');
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

// B.3. END -----------------------------------------------------------------------------------------------------------

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================

// GULP TASK [DEVELOPMENT] ============================================================================================

// A. CSS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('compile-sass', function () {

gulp.src(ROOT + '/assets/css/stylesheet.scss')
.pipe(sass({ 
    loadPath: [ROOT + '/assets/css'], 
    //'sourcemap=none': true,
    style: 'expanded'
})
    .on('error', gutil.log))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(rename({ base : 'styles'}))
    .pipe(gulp.dest(ROOT + '/assets/css/'))
    gutil.log(gutil.colors.cyan('++ Built stylesheet.css + stylesheet.css.map'));

});

// A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// B. JAVASCRIPT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

gulp.task('compile-js', function() {
  gulp.src([
            ROOT + '/assets/js/scripts/*.js',
            ROOT + '/assets/js/scripts/*.*.js'
           ])
    .pipe(jshint(process.cwd() + '/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('app.js'))
    .pipe(gulp.dest(ROOT + '/assets/js/'))
    gutil.log(gutil.colors.cyan('++ Built app.js'));

});

// B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// END ================================================================================================================

// GULP TASK [DEFAULT] ================================================================================================

gulp.task('default', function () {

    // A. START SERVER + LIVERELOAD +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    startExpress();
    startLivereload();

    // A. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // A. WATCH FOR CHANGES +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        // A.1. Watch HTML changes

        gulp.watch([ROOT + '/*.html',
                    ROOT + '/*/*.html',
                    ROOT + '/**/*/*.html',
                    ROOT + '/assets/css/stylesheet.css',
                    ROOT + '/assets/js/app.js'],
                    notifyLivereload);

        // A.2. Watch SASS Changes

        gulp.watch(ROOT + '/assets/css/**/*.scss', ['compile-sass']);

        // A.3. Watch JS Changes

        gulp.watch(ROOT + '/assets/js/scripts/*', ['compile-js']);

    // B. END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

});

// END OF FILE ========================================================================================================