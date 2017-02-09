const chapters = [
  ['index','overview','magic','people','places','organizations','characters'],
  ['classes', 'barbarian', 'cleric', 'monk', 'ranger', 'rogue', 'wizard']
];

var gulp = require('gulp');

var markdown     = require('gulp-markdown'),
    sass         = require('gulp-sass'),
    uglify       = require('gulp-uglify'),
    tap          = require('gulp-tap'),
    headerfooter = require('gulp-headerfooter');
    
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
      
      next_chap = '';
      next_chap_link = '';
      last_chap = '';
      last_chap_link = '';
      index = '';
      index_link = '';
      
      let chapter_id = -1;
      let book_id = -1;
      
      // find the book and chapter id for this page
      for (let i = 0; i < chapters.length; i++) {
        for (let j = 0; j < chapters[i].length; j++) {
          const this_chapter = chapters[i][j];
          if (filename == this_chapter) {
            book_id = i;
            chapter_id = j;
          }
        }
      }
      
      if (book_id > -1) { // if the chapter is in a book
        // set the index chapter to be the first chapter
        index = chapters[book_id][0];
        index_link = index + ".html";
        if (chapter_id > 0) { // not the first chapter
          last_chap = chapters[book_id][chapter_id - 1];
          last_chap_link = last_chap + ".html";
        }
        if (chapter_id < chapters[book_id].length - 1) { // not the last chapter
          next_chap = chapters[book_id][chapter_id + 1];
          next_chap_link = next_chap + ".html";
        }
      } else {
        // set the index chapter to be this chapter
        index = filename;
        index_link = filename + ".html";
      }
      
      var contents = file.contents.toString();
      contents = contents.replace(/{{chapter}}/g, capitalizeFirstLetter(filename));
      contents = contents.replace(/{{last-chap}}/g, last_chap);
      contents = contents.replace(/{{last-chap-link}}/g, last_chap_link);
      contents = contents.replace(/{{next-chap}}/g, next_chap);
      contents = contents.replace(/{{next-chap-link}}/g, next_chap_link);
      contents = contents.replace(/{{index}}/g, index);
      contents = contents.replace(/{{index-link}}/g, index_link);
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