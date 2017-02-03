var chapters = [
  'index',
  'overview',
  'magic',
  'people',
  'places',
  'organizations',
  'characters'];

var gulp = require('gulp');

var markdown   = require('gulp-markdown'),
  sass         = require('gulp-sass'),
  include      = require('gulp-include'),
  rename       = require('gulp-rename'),
  inject       = require('gulp-inject-string'),
  tap          = require('gulp-tap'),
  headerfooter = require('gulp-headerfooter'),
  insert       = require('gulp-insert');

gulp.task('styles', function() {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});
 
gulp.task('assemblehtml', function () {
  // var chap, last_chap, next_chap;
  
  gulp.src('src/book/**/*.md')
    // parse markdown
    .pipe(markdown())
    // add header and footer templates
    // .pipe(headerfooter.header('src/templates/header.html'))
    // .pipe(headerfooter.footer('src/templates/footer.html'))
    // find correct navigation in chapters array
    // .pipe(tap(function(file, t) {
      // var filename = file.relative.split('.')[0];
      // 
      // var chapter_id = -1;
      // for (var i = 0; i < chapters.length; i++) {
      //   if (chapters[i] == filename) {
      //     chapter_id = i;
      //   }
      // }
      // 
      // if (chapter_id > 0) {
      //   last_chap = chapters[chapter_id - 1];
      // }
      // if (chapter_id < chapters.length - 1) {
      //   next_chap = chapters[chapter_id + 1];
      // }
      
      // return gulp.src(file.path)
        // .pipe(inject.replace('{{chapter}}', filename))
        // .pipe(inject.replace('{{last_chap}}', last_chap))
        // .pipe(inject.replace('{{next_chap}}', next_chap))
        .pipe(gulp.dest('build'));
    // }))
});

//Watch task
gulp.task('default',function() {
  gulp.watch('src/sass/**/*.scss',['styles']);
  gulp.watch('src/book/**/*.md',['assemblehtml']);
  // gulp.watch('src/book/templates/*.html',['assemblehtml']);
});