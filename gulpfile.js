var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  copy = require('gulp-copy'),
  htmlPrettify = require('gulp-prettify'),
  cssPrettify = require('gulp-cssbeautify'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;

gulp.task('default', ['html', 'css', 'js', 'copy'], function() {
  browserSync.reload();
})

gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(htmlPrettify())
    .pipe(gulp.dest('./build/'));
});

gulp.task('js', ['vendor-js'], function() {
  // we're loading util.js first so the other modules can use it
  return gulp.src(['./src/js/lib/util.js', './src/js/lib/*.js', './src/js/app.js'])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('vendor-js', function() {
  return gulp.src('./src/js/vendor/{jquery,js.cookie,what-input,color,foundation}.min.js')
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('css', ['vendor-css'], function() {
  gulp.src('./src/css/app.css')
    .pipe(cssPrettify())
    .pipe(gulp.dest('./build/css/'))
});

gulp.task('vendor-css', function() {
  return gulp.src('./src/css/vendor/*.css')
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('copy', function() {
  gulp.src(['./src/js/vendor/*', './src/css/vendor/*','./src/wordlists/*.json'])
    .pipe(copy('./build/', {
      prefix: 1
    }))
});

gulp.task('watch', function() {
  browserSync({
    server: {
      baseDir: 'build'
    }
  });

  gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {
    cwd: 'src'
  }, ['default'])
});
