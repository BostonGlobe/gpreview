#!/usr/bin/env node

const gulp = require('gulp')
const chalk = require('chalk')
const bs = require('browser-sync').create()
const runSequence = require('run-sequence')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const fs = require('fs')

const argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'serve "ai2html-output" to localhost:3000 (default command)')

	.demand(0, 'asdf')

	.help('h')
	.alias('h', 'help')
	.version()
	.argv

gulp.task('default', function(done) {
	runSequence(
		'html',
		'watch',
		'serve',
		done
	)
})

gulp.task('html', function() {
	return gulp.src('index.html', { cwd: __dirname })
		.pipe(replace('|||gpreview|||', fs.readFileSync('test.html', 'utf8')))
		.pipe(rename('temp.html'))
		.pipe(gulp.dest('.', { cwd: __dirname }))
})

gulp.task('html-watch', ['html'], function(done) {
	bs.reload()
	done()
})

gulp.task('watch', function() {
	gulp.watch('test.html', ['html-watch'])
})

gulp.task('serve', function() {
	bs.init({
		server: {
			baseDir: __dirname,
			index: 'temp.html'
		},
		notify: false,
	})
})

gulp.start('default')