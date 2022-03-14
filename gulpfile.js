
let distFolder = 'dist';
let srcFolder = 'src';

let path = {
  build: {
    html: distFolder + "/",
    css: distFolder + "/css/",
    js: distFolder + "/js/",
    img: distFolder + "/img/",
    fonts: distFolder + "/fonts/",
  },
  src: {
    html: [srcFolder + "/**/*.html", "!" + srcFolder + "/**/_*.html"],
    css: [srcFolder + "/scss/**/*.scss", "!" + srcFolder + "/scss/**/_*.scss"],
    js: srcFolder + "/js/**/*.js",
    img: srcFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: srcFolder + "/fonts/*.ttf",
  },
  watch: {
    html: srcFolder + "/**/*.html",
    css: srcFolder + "/scss/**/*.scss",
    js: srcFolder + "/js/**/*.js",
    img: srcFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + distFolder + "/"
}

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  cleanCSS = require('gulp-clean-css'),
  rename = require('gulp-rename');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + distFolder + "/"
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(scss({
      outputStyle: "expanded"
    }))
    .pipe(
      autoprefixer({
        overrideBrowserlist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(group_media())
    .pipe(dest(path.build.css))
    .pipe(
      cleanCSS(
        { compatibility: 'ie8' }
      )
    )
    .pipe(
      rename({
        extname: ".min.css"
      })
    )

    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}

function img() {
  return src(path.src.img)
    .pipe(dest(path.build.img))
}


function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.img], img)
  gulp.watch([path.watch.js], js)
}

let build = gulp.series(clean, fonts, img, gulp.parallel(css, html, js))
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
