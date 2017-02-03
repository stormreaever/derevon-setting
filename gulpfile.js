var chapters = ['index','overview','magic','people','places','organizations','characters'];

var gulp = require('gulp');

var markdown   = require('gulp-markdown'),
  sass         = require('gulp-sass'),
  uglify       = require('gulp-uglify'),
  tap          = require('gulp-tap'),
  headerfooter = require('gulp-headerfooter');

gulp.task('styles', function() {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

gulp.task('scripts', function() {
  gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
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
      
      var contents = file.contents.toString();
      contents = contents.replace(/{{chapter}}/g, filename);
      contents = contents.replace(/{{last-chap}}/g, last_chap);
      contents = contents.replace(/{{next-chap}}/g, next_chap);
      file.contents = new Buffer(contents, "utf-8");
    }))
    .pipe(gulp.dest('build'));
});

//Watch task
gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.scss',['styles']);
  gulp.watch('src/js/**/*.js',['scripts']);
  gulp.watch('src/book/**/*.md',['assemblehtml']);
  gulp.watch('src/templates/**/*.html',['assemblehtml']);
});

gulp.task('default', ['styles', 'scripts', 'assemblehtml']);