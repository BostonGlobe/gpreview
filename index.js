#!/usr/bin/env node

const gulp = require('gulp')
const chalk = require('chalk')
const bs = require('browser-sync').create()
const runSequence = require('run-sequence')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const fs = require('fs')
const url = require('url')
const proxy = require('proxy-middleware')
const glob = require('glob-fs')({ gitignore: true })

const argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'serve "ai2html-output" to localhost:3000 (default)')

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

	const files = glob.readdirSync('ai2html-output/*.html')
		.map(v => fs.readFileSync(v, 'utf8'))
		.join('')

	return gulp.src('index.html', { cwd: __dirname })
		.pipe(replace('|||ai2html-output|||', files))
		.pipe(rename('temp.html'))
		.pipe(gulp.dest('.', { cwd: __dirname }))

})

gulp.task('html-watch', ['html'], function(done) {
	bs.reload()
	done()
})

gulp.task('watch', function() {
	gulp.watch('ai2html-output/*.*', ['html-watch'])
})

gulp.task('serve', function() {

	let cssProxy = url.parse('https://www.bostonglobe.com/css')
	cssProxy.route = '/css'

	let jsProxy = url.parse('https://www.bostonglobe.com/js')
	jsProxy.route = '/js'

	let rwProxy = url.parse('https://www.bostonglobe.com/rw')
	rwProxy.route = '/rw'

	let rfProxy = url.parse('https://www.bostonglobe.com/rf')
	rfProxy.route = '/rf'

	bs.init({
		server: {
			baseDir: __dirname,
			index: 'temp.html',
			middleware: [
				proxy(cssProxy),
				proxy(jsProxy),
				proxy(rwProxy),
				proxy(rfProxy),
			],
		},
		notify: false,
	})
})

gulp.start('default')
