var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var path = require('path');

var CSS = [
  "bower_components/bootstrap/dist/css/bootstrap.min.css",
  "bower_components/bootstrap/dist/css/bootstrap-theme.min.css",
  "src/styles/main.css"
];

var JS = [
  "bower_components/jquery/dist/jquery.js",
  "bower_components/bootstrap/dist/js/bootstrap.js"
];

gulp.task('less', function () {
  gulp.src('./src/styles/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'src', 'styles')]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('src/styles/'));
});

gulp.task('concatCSS', function () {
  gulp.src(CSS)
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('build/styles/'));
});

gulp.task('concatJS', function () {
  gulp.src(JS)
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('copyStatic', function () {
  gulp.src('./src/fonts/*')
    .pipe(gulp.dest('build/fonts'));
  gulp.src('./src/images/*')
    .pipe(gulp.dest('build/images'));
});

// requires index.js which starts the compile process
gulp.task('compile', function () {
  require('./');
});

gulp.task('default', ['compile', 'less', 'concatCSS', 'concatJS', 'copyStatic']);
