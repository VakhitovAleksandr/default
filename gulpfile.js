
const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const fileinclude = require('gulp-file-include');
const group_media = require('gulp-group-css-media-queries')
const rename = require('gulp-rename');


function browsersync() {
  browserSync.init({
    server: { baseDir: 'dist/' },
    notify: false,
    online: true
  })
}

function html() {
  return src('src/**/[^_]*.html')
    .pipe(fileinclude())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream())
}

function style() {
  return src('src/scss/[^ _]*.scss')
    .pipe(eval(sass()))
    .pipe(autoprefixer({ overrideBrowsersList: ['last 10 versions'], grid: true }))
    .pipe(group_media())
    .pipe(dest('dist/css/'))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(dest('dist/css/'))
    .pipe(browserSync.stream())

}

function scripts() {
  return src([
    'src/js/app.js',
  ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream())
}

function startwatch() {
  watch('src/**/*.js', scripts);
  watch('src/**/*.scss', style);
  watch('src/**/*.html', html).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.style = style;
exports.html = html;

exports.default = parallel(scripts, html, style, browsersync, startwatch);
