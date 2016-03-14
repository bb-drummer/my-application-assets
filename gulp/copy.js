var gulp = require('gulp');

var MYFILES = [
  'assets/**/*',
  '!assets/{js,scss}',
  '!assets/{js,scss}/**/*',
  '!assets/*.{js,scss}',
  '!assets/**/*.{js,scss}'
];

var DOCFILES = [
  'docs/assets/**/*',
  '!docs/assets/{js,scss}',
  '!docs/assets/{js,scss}/**/*'
];

// Copies static assets
gulp.task('copy', function() {
  gulp.src(MYFILES)
    .pipe(gulp.dest('dist'));
  gulp.src(DOCFILES)
    .pipe(gulp.dest('_build/assets'));
});
