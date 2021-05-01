const gulp = require('gulp')
const watch = require('gulp-watch')
const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const rollup = require('gulp-rollup')
const replace = require('@rollup/plugin-replace')

// 入口
const entry = "./src/server/**/*.js";
const cleanEntry = "./src/server/config/index.js";

// 开发环境
function buildDev() {
    // watch：出错后会马上停止，用gulp-plumber
    return watch(entry,{
        ignoreInitial: false
    }, () => {
        gulp.src(entry)
        .pipe(plumber())
        .pipe(
            babel({
                babelrc: false,
                // 将es6转换为commonjs
                "plugins": ["@babel/plugin-transform-modules-commonjs"]
            })
        )
        // 打包
        .pipe(gulp.dest('dist'))
    })
}

// 生产环境
function buildProd() {
    return gulp.src(entry)
        .pipe(
            babel({
                babelrc: false,
                ignore: [cleanEntry],
                // 将es6转换为commonjs
                "plugins": ["@babel/plugin-transform-modules-commonjs"]
            })
        )
        // 打包
        .pipe(gulp.dest('dist'))
}

// 流清洗
function buildConfig() {
    return gulp.src(entry)
        .pipe(rollup({
            input: cleanEntry,
            // 将es6转换为commonjs
            output: {
                format: 'cjs'
            },
            plugins: [
                // 删除多余配置
                replace({
                    'process.env.NODE_ENV': JSON.stringify('production')
                })
            ]
        }))
        // 打包
        .pipe(gulp.dest('dist'))
}

let build = gulp.series(buildDev)
 
if(process.env.NODE_ENV === 'production') {
    // 默认串行
    build = build.series(buildProd, buildConfig)
}

gulp.task('default', build)