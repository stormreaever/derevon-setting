var gulp = require('gulp');

var markdown = require('gulp-markdown'),
  sass = require('gulp-sass');

gulp.task('styles', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});
 
gulp.task('markdown', function () {
  return gulp.src('src/book/**/*.md')
    .pipe(markdown())
    .pipe(gulp.dest('build/book'));
});

//Watch task
gulp.task('default',function() {
  gulp.watch('src/sass/**/*.scss',['styles']);
  gulp.watch('src/book/**/*.md',['markdown']);
});