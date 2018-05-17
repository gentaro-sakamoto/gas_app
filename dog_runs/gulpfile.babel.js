import gulp from 'gulp';
import rename from 'gulp-rename';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

const compileFile = 'main.js';

gulp.task('build', () => {
  browserify({
    entries: ['js/' + compileFile]
  })
  .transform('babelify')
  .plugin('gasify')
  .bundle()
  .pipe(source(compileFile))
  .pipe(rename('main.bundle.js'))
  .pipe(gulp.dest('build'));
});

gulp.task('default', ['build'], () => {});
