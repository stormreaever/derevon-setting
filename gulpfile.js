var chapters = ['index','overview','magic','people','places','organizations','characters'];

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
  var filename;
  var next_chap;
  var last_chap;
  
  gulp.src('src/book/**/*.md')
    // parse markdown
    .pipe(markdown())
    // add header and footer templates
    .pipe(headerfooter('src/templates/header.html', 'src/templates/footer.html'))
    // find correct navigation in chapters array
    .pipe(tap(function(file, t) {
      filename = file.relative.split('.')[0];
      // var filename = people;
      
      next_chap = '';
      last_chap = '';
      
      var chapter_id = -1;
      
      for (var i = 0; i < chapters.length; i++) {
        if (chapters[i] == filename) {
          chapter_id = i;
        }
      }
      if (chapter_id > 0) {
        last_chap = chapters[chapter_id - 1];
      }
      if (chapter_id < chapters.length - 1) {
        next_chap = chapters[chapter_id + 1];
      }
      console.log(filename);
      
      var contents = file.contents.toString();
      contents = contents.replace(/{{chapter}}/g, filename);
      contents = contents.replace(/{{last-chap}}/g, last_chap);
      contents = contents.replace(/{{next-chap}}/g, next_chap);
      file.contents = new Buffer(contents, "utf-8");
      
      // .pipe(inject.replace('{{chapter}}', filename))
      // .pipe(inject.replace('{{last-chap}}', last_chap))
      // .pipe(inject.replace('{{next-chap}}', next_chap));
    }))
    .pipe(gulp.dest('build'));
    // .pipe(inject.replace('{{chapter}}', filename))
    // .pipe(inject.replace('{{last-chap}}', last_chap))
    // .pipe(inject.replace('{{next-chap}}', next_chap))
    // .pipe(gulp.dest('build/test'));
    // console.log(filename);
});

//Watch task
gulp.task('default',function() {
  gulp.watch('src/sass/**/*.scss',['styles']);
  gulp.watch('src/book/**/*.md',['assemblehtml']);
  gulp.watch('src/book/templates/*.html',['assemblehtml']);
});