var gulp = require('gulp');
var less = less = require("gulp-less");
var uglify = require("gulp-uglify");
var browserify = require("browserify");
var replace = require("gulp-replace");
var fs = require('fs');

gulp.task('default', function() {
    console.log('gulp start');
    gulp.run('all');
    gulp.watch('views/**/*', function () {
        console.log('build');
        gulp.run('all');
    });
});
gulp.task('all', function () {
    gulp.src(['views/css/*.less'])
        .pipe(less({
            compress: true
        }))
        .pipe(gulp.dest('views/css'));

    //gulp.src(['resources/assets/script/*.js','resources/assets/script/**/*.js'])
    //    .pipe(replace(/require\("(.*?)"\)/g, function () {
    //        var file = ''+arguments[1];
    //        var html = fs.readFileSync('resources/assets/script/' + file + '.html').toString().replace(/\n/g, '').replace(/\s{2,}/g, ' ');
    //        html = html.replace(/"/g, '\\"');
    //        return '"' + html + '"';
    //
    //    }))
    //    .pipe(uglify({
    //        mangle: false,
    //        preserveComments: function(o, info) {
    //            return /@(cc_on|if|else|end|_jscript(_\w+)?)\s/i.test(info.value);
    //        }
    //    }))
    //    .pipe(gulp.dest('public/assets/script'));
});