#!/usr/bin/env node

const gulp = require('gulp')
const chalk = require('chalk')
const bs = require('browser-sync').create()
const runSequence = require('run-sequence')
const replace = require('gulp-replace')
const fs = require('fs-extra')
const url = require('url')
const proxy = require('proxy-middleware')
const globby = require('globby')
const path = require('path')
const shell = require('shelljs')

const argv = require('yargs')
	.usage('Usage: $0 <command>')
	.command('new', 'serve "ai2html-output" to localhost:3000 (default)')

	.demand(0, 'asdf')

	.help('h')
	.alias('h', 'help')
	.version()
	.argv

const log = (s) =>
	console.log(chalk.green(s))

gulp.task('default', function(done) {
	runSequence(
		'copy',
		'html',
		'watch',
		'serve',
		done
	)
})

// Copy files from process.cwd()/ai2html-output to __dirname.
gulp.task('copy', function(done) {

	log('Copying ai2html-output html.')

	// If __dirname/temp doesn't exist,
	if (!shell.test('-e', path.join(__dirname, 'temp'))) {

		// create it.
		shell.mkdir(path.join(__dirname, 'temp'))

	}

	// Copy ai2html-output contents over.
	shell.cp(
		path.join(process.cwd(), 'ai2html-output/*.*'),
		path.join(__dirname, 'temp')
	)

	done()

})

// Inject ai2html-output/*.html content into index.html.
gulp.task('html', function(done) {

	log('Building html.')

	const files = globby.sync([
			path.join(__dirname, 'temp/*.html'),
			'!' + path.join(__dirname, 'temp/index.html')
		])
		.map(v => fs.readFileSync(v, 'utf8'))
		.join('')

	return gulp.src('index.html', { cwd: __dirname })
		.pipe(replace('|||ai2html-output|||', files))
		.pipe(gulp.dest('temp', { cwd: __dirname }))

	done()

})

// Run the `html` task, then reload browsersync.
gulp.task('html-watch', ['html'], function(done) {

	log('Reloading html.')

	bs.reload()

	done()

})

// Watch files.
gulp.task('watch', function() {

	log('Watching files.')

	gulp.watch('ai2html-output/*.*', ['copy'])
	gulp.watch('temp/*.*', { cwd: __dirname }, ['html-watch'])

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
			baseDir: path.join(__dirname, 'temp'),
			index: 'index.html',
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
