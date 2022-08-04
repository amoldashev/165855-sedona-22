const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const terser = require("gulp-terser");
const webpConverter = require("gulp-webp");
const svgStore = require("gulp-svgstore");
const svgMin = require("gulp-svgmin");
const squoosh = require("gulp-squoosh");

// styles
const styles = () => {
  return gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
}

exports.styles = styles;

// Server
const server = (done) => {
  browserSync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/**/*.js"), gulp.series(scripts, browserSync.reload);
  gulp.watch("source/*.html"), gulp.series(html, browserSync.reload);
}

// html
const html = () => {
  return gulp
    .src("source/index.html")
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest("build"));
};

exports.html = html;

// scripts
const scripts = () => {
  return gulp
    .src("source/js/index.js")
    .pipe(terser())
    .pipe(rename("index.min.js"))
    .pipe(gulp.dest("build/js"));
}

exports.scripts = scripts;

// copy
const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2, woff}",
    "source/*.ico",
    "source/*.webmanifest",
    "!source/img/**/*.{jpg,png,svg}",
    "!source/js/index.js"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

// clean
const clean = () => {
  return del("build");
}

exports.clean = clean;

// copy images
const copyImages = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(gulp.dest("build/img"));
}

exports.copyImages = copyImages;

// convert images
const convertImages = () => {
  return gulp
    .src("source/img/*.{png,jpg}")
    .pipe(webpConverter({quality: 70}))
    .pipe(gulp.dest("build/img"));
}

exports.convertImages = convertImages;

// optimize images
const optimizeImages = () => {
  return gulp.src('build/img/**/*.{png,jpg,svg}')
    .pipe(squoosh({encodeOptions: {webp: {}}}))
    .pipe(gulp.dest('build/img'));
}

// sprites
const setSprites = () => {
  return gulp
    .src('source/img/icons/*.svg')
    .pipe(svgMin())
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgStore({
      inlineSvg: true,
      SymbolAttrs: true,
      copyAttrs: true,
    }))
    .pipe(rename('main.svg'))
    .pipe(gulp.dest('build/img'));
}

exports.setSprites = setSprites;

// npm start
exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    convertImages,
    setSprites
  ),
  server,
  watcher,
);

// npm build
exports.build = gulp.series(
  clean,
  copy,
  copyImages,
  optimizeImages,
  gulp.parallel(
    styles,
    convertImages,
    html,
    scripts,
    setSprites,
  ),
  server,
  watcher,
);
