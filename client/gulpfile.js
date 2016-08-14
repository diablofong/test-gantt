var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    wiredep = require('wiredep').stream;

gulp.task('server', function () {
  connect.server({
    root: ['.'],
    livereload: true
  });
});


gulp.task('livereload', function () {
  gulp.src(['./index.html','./index.js'])
      .pipe(watch(['./index.html','./index.js']))
      .pipe(connect.reload());
});

gulp.task('wiredep', function () {
  gulp.src('index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['server', 'livereload','wiredep']);

