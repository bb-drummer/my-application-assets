var gulp = require('gulp');

var MYFILES = [
  'src/assets/**/*',
  '!src/assets/{js,scss}',
  '!src/assets/{js,scss}/**/*',
  '!src/assets/*.{js,scss}',
  '!src/assets/**/*.{js,scss}'
];

var DOCFILES = [
  'src/docs/assets/**/*',
  '!src/docs/assets/{js,scss}',
  '!src/docs/assets/{js,scss}/**/*'
];

// Copies static assets
gulp.task('copy', function() {
  gulp.src(MYFILES)
    .pipe(gulp.dest('dist'));
  gulp.src(DOCFILES)
    .pipe(gulp.dest('_build/assets'));
});
