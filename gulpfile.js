const gulp = require('gulp'),
      browserSync = require('browser-sync'),
      less = require('gulp-less'),
      prefixer = require('gulp-autoprefixer'),
      babel = require('gulp-babel'),
      concat = require('gulp-concat'),
      del = require('del'),
      fi = require('gulp-file-include');


gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: './',
    },
    notify: false
  })
})

gulp.task('include', () => {
  gulp.src('./src/*.html')
    .pipe(fi({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('less', () => {
  gulp.src('./less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./css'));
});

gulp.task('prefixer', () =>
  gulp.src('css/style.css')
    .pipe(prefixer({
      browsers: ['last 5 versions'],
      cascade: true,
      grid: true,
      remove: false
    }))
    .pipe(gulp.dest('./css'))
);

gulp.task('concat', () => {
  del.sync(['./js/app.js', '!js'])
  gulp.src('js/*.js')
    .pipe(concat('app.js', { newLine: "\r\n\n" }))
    .pipe(gulp.dest('./js'))
});

gulp.task('babel', () => {
  gulp.src('js/app.js')
    .pipe(babel())
    .pipe(gulp.dest('./js'))
});


gulp.task('watch', ['server', 'less', 'prefixer', 'include', 'concat', 'babel'], () => {
  gulp.watch('./src/*.html', ['include'], browserSync.reload);
  gulp.watch('./less/**/*.less', ['less'], browserSync.reload);
  gulp.watch('./css/style.css', ['prefixer'] );
  gulp.watch('./css/style.css', browserSync.reload);
  gulp.watch('./js/*.js', ['concat']);
  gulp.watch('./js/*.js', ['babel']);
  gulp.watch('./js/*.js', ['include'], browserSync.reload);
  gulp.watch('./*.html', browserSync.reload);
})