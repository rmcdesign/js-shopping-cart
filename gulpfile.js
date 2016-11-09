
var scripts = [
        './js/main.js'
    ],
    scss_source = './sass/**/*.scss',
    css_dest = './css',
    js_src = './js',
    js_dest = './js',
    concat_script_name = 'scripts.js',
    minify_suffix = '.min',
    gulp = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    watch = require( 'gulp-watch' ),
    cssnano = require('gulp-cssnano'),
    jshint = require( 'gulp-jshint' ),
    stylish = require( 'jshint-stylish' ),
    gulpconcat = require('gulp-concat'),
    uglify = require( 'gulp-uglify' ),
    rename = require( 'gulp-rename' ),
    sass = require( 'gulp-sass' ),
    gcmq = require('gulp-group-css-media-queries'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer-core'),
    browserSync = require('browser-sync').create(),
    gulp_handlebars = require('gulp-handlebars'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare');


gulp.task('compile-templates', function() {
    gulp.src('templates/*.hbs')
        .pipe(gulp_handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'rmc',
            noRedeclare: true
        }))
        .pipe(gulpconcat('templates.js'))
        .pipe(gulp.dest('templates'));
});

var onError = function( err ) {
    console.log( 'An error occurred:', err.message );
    this.emit( 'end' );
};

gulp.task( 'scss', function() {
    return gulp.src( scss_source )
        .pipe( plumber( { errorHandler: onError } ) )
        .pipe( sass() )
        .pipe( gcmq() )
        .pipe( postcss([ autoprefixer({ browsers: ['last 5 versions'] }) ]) )
        .pipe( gulp.dest( css_dest ) )
        .pipe( sourcemaps.init())
        .pipe( cssnano({
            safe: true,
            discardComments: {removeAll: true}
        }) )
        .pipe( rename( { suffix: minify_suffix } ) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest( css_dest ) )
        .pipe( browserSync.stream() );
});

gulp.task('scripts', function() {
    return gulp.src(scripts)
        .pipe( jshint() )
        .pipe( jshint.reporter(stylish) )
        .pipe( gulpconcat( concat_script_name ) )
        .pipe( gulp.dest( js_dest ) )
        .pipe( rename({suffix: minify_suffix}) )
        .pipe( uglify())
        .pipe( gulp.dest( js_dest ) )
        .pipe( browserSync.stream() );
});

gulp.task( 'watch', function() {

    browserSync.init({
        proxy: "localhost:8888/deloitte"
    });

    gulp.watch( scss_source, [ 'scss' ] );
    gulp.watch( js_src + '/**/*.js', [ 'scripts' ] );
    gulp.watch( 'templates/**/*.hbs', ['compile-templates']);
    gulp.watch( './**/*.html' ).on( 'change', function( file ) {
        browserSync.reload
    });
});

gulp.task( 'default', [ 'scss', 'watch' ], function() {
    console.log('gulp running and watching for changes');
});
