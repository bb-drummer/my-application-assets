var gulp = require('gulp');
var browser = require('browser-sync');
var requireDir = require('require-dir');
var port = process.env.SERVER_PORT || 3000;

requireDir('./gulp');

// Builds the documentation and framework files
gulp.task('build', ['clean', 'copy', 'docs:all', 'sass', 'javascript', 'deploy']);

// Starts a BrowerSync instance
gulp.task('serve', ['build'], function(){
  browser.init({server: './_build', port: port});
});

// Runs all of the above tasks and then waits for files to change
gulp.task('default', ['build'], function() {
  gulp.watch('src/docs/**/*', ['docs', browser.reload]);
  gulp.watch(['src/docs/layout/*.html', 'src/docs/partials/*.html'], ['docs:all', browser.reload]);
  gulp.watch('src/scss/**/*', ['sass', browser.reload]);
  gulp.watch('src/docs/assets/scss/**/*', ['sass:docs', browser.reload]);
  gulp.watch('src/js/**/*', ['javascript:myapplication', browser.reload]);
  gulp.watch('src/docs/assets/js/**/*', ['javascript:docs', browser.reload]);
});
