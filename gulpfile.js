/*插件引入模块*/
const gulp = require("gulp");
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');



/*测试模块，检测代码是否有错误*/
	gulp.task("test",function(){
		console.log("代码正常！");
	});



/*任务组合模块*/
	gulp.task("build",['copyHtml','copyImg','copyData']);
	
/*任务监听模块*/
	gulp.task('watch',function(){
		gulp.watch('code/*.html',['copyIndex']);
		gulp.watch('code/html/*.html',['copyHtml']);
		gulp.watch('code/sass/*.scss',['sass']);
		gulp.watch('code/src/**/*',['copyAll']);
		gulp.watch("code/js/*.js",['babel']);
		gulp.watch("code/css/**/*",['copyCss']);
		gulp.watch("code/iconfont/**/*",['copyFont'])
	})

/*服务器模块*/
	gulp.task("server",function(){
		connect.server({
			root:"dist",
			livereload:true
		});	
	})



/*默认任务模块*/
	gulp.task("default",['server','watch']);




/*文档操作模块*/
//首页拷贝
	gulp.task("copyIndex",function(){
		gulp.src("code/index.html").pipe(gulp.dest("dist")).pipe(connect.reload());
	});
//页面拷贝
	gulp.task("copyHtml",function(){
		gulp.src("code/html/*.html").pipe(gulp.dest("dist/html")).pipe(connect.reload());
	});
//图片拷贝（以png和jpg为后缀）
	gulp.task("copyImg",function(){
		gulp.src("code/img/*.{png,jpg}").pipe(gulp.dest("dist/src"));
	});
//全拷贝（包含子文件，不包含删除最后一个/*）
	gulp.task("copyAll",function(){
		gulp.src("code/src/**/*").pipe(gulp.dest("dist/src"));
	});
	gulp.task("copyCss",function(){
		gulp.src("code/css/**/*").pipe(gulp.dest("dist/css"));
	});
	gulp.task("copyFont",function(){
		gulp.src("code/iconfont/**/*").pipe(gulp.dest("dist/iconfont"));
	});
	
	
	
//多文件夹指定内容拷贝
	gulp.task("copyData",function(){
		gulp.src(['code/json/*.json','code/xml/*.xml']).pipe(gulp.dest("dist/data"));
	});
	
	
	
	
/*sass*/
	gulp.task("sass",function(){
		gulp.src('code/sass/*.scss')
		.pipe(sourcemaps.init())
	  	.pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
	  	.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'));
	})



/*JS操作模块*/
	//文档合并
	gulp.task('concat',function(){
		gulp.src(['code/js/doAdd.js','code/js/doMulti.js'])
		.pipe(babel({"presets":["es2015"]}))
		.pipe(concat('exec.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest('dist/js'))
	})
	//转ES5并压缩
	gulp.task("babel",function(){
		gulp.src("code/js/*.js")
		.pipe(babel({"presets":["es2015"]}))
		.pipe(uglify())
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest("dist/js"))
		.pipe(connect.reload())
	})