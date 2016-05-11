var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');

var sass = require('gulp-sass');
// var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');

var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// --------------------------
// STYLES
// --------------------------
gulp.task('styles', () =>
  gulp.src('./client/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/build/styles'))
    .pipe(reload({ stream: true }))
);

// --------------------------
// BROWSER/SERVER SYNC
// --------------------------
gulp.task('browser-sync', ['nodemon'], () => {
  browserSync({
    // server: {},
    proxy: 'http://localhost:5000',
    browser: 'google chrome',
    ghostMode: false
  });
});

gulp.task('nodemon', cb => {
  var started = false;

  return nodemon({
    script: './server/app.js',
    ignore: [
      './node_modules/**',
      './client/build/**'
    ]
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  }).on('restart', () => {
    setTimeout(() => {
      reload({ stream: true });
    }, 1000);
  });
});

// --------------------------
// BUILD
// --------------------------
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
  var props = {
    entries: ['./client/app/' + file],
    debug: true,
    cache: {},
    packageCache: {},
    transform: [babelify.configure({
      presets: ['es2015', 'react']
    })]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./client/build/'))
      // If you also want to uglify it
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('./client/build'))

      .pipe(reload({ stream: true }));
  }

  // listen for an update and run rebundle
  bundler.on('update', () => {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

// this will run once because we set watch to false
gulp.task('scripts', () => buildScript('main.js', false));

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['styles', 'scripts', 'browser-sync'], () => {
  gulp.watch('client/styles/**/*', ['styles']); // gulp watch for stylus changes
  return buildScript('main.js', true); // browserify watch for JS changes
});
