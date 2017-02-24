#!/usr/bin/env node

import gulp from 'gulp'
import chalk from 'chalk'
import browserSync from 'browser-sync'
import runSequence from 'run-sequence'
import replace from 'gulp-replace'
import fs from 'fs-extra'
import url from 'url'
import proxy from 'proxy-middleware'
import globby from 'globby'
import path from 'path'
import shell from 'shelljs'
import yargs from 'yargs'

const bs = browserSync.create()

const argv = yargs
	.usage('Usage: $0 <command>')
	.command('new', 'serve "ai2html-output" to localhost:3000 (default)')

	.demand(0, 'asdf')

	.help('h')
	.alias('h', 'help')
	.version()
	.argv

// Convenience logging function.
const log = (s) =>
	console.log(chalk.green(s))

// Default gulp task.
gulp.task('default', (done) => {
	runSequence(
		'copy'
		// 'build-html',
		// 'watch',
		// 'serve',
		// done
	)
})

// Copy files from process.cwd()/ai2html-output to __dirname.
gulp.task('copy', (done) => {

	// TODO: If __dirname/ai2html-output doesn't exist, abort.

	log('Copying ai2html-output html.')

	fs.copySync(
		path.join(process.cwd(), 'ai2html-output'),
		path.join(__dirname, 'temp')
	)

	// // If __dirname/temp doesn't exist,
	// if (!shell.test('-e', path.join(__dirname, 'temp'))) {

	// 	// create it.
	// 	shell.mkdir(path.join(__dirname, 'temp'))

	// }

	// // Copy ai2html-output contents over.
	// shell.cp(
	// 	path.join(process.cwd(), 'ai2html-output/*.*'),
	// 	path.join(__dirname, 'temp')
	// )

	done()

})

// // Inject ai2html-output/*.html content into index.html.
// gulp.task('build-html', function(done) {

// 	log('Building html.')

// 	// Get contents from the ai2html-output html file (but not index.html).
// 	const files = globby.sync([
// 			path.join(__dirname, 'temp/*.html'),
// 			'!' + path.join(__dirname, 'temp/index.html')
// 		])
// 		.map(v => fs.readFileSync(v, 'utf8'))
// 		.join('')

// 	// Insert above content into index.html.
// 	return gulp.src('index.html', { cwd: __dirname })
// 		.pipe(replace('|||ai2html-output|||', files))
// 		.pipe(gulp.dest('temp', { cwd: __dirname }))

// 	done()

// })

// // Watch files.
// gulp.task('watch', function() {

// 	log('Watching files.')

// 	// If source ai2html-output changes, bring it over.
// 	gulp.watch('ai2html-output/*.html', ['copy'])

// 	// If our ai2html-output html files change, build html.
// 	gulp.watch([
// 		'temp/*.html',
// 		'!temp/index.html',
// 	], { cwd: __dirname }, ['build-html'])

// 	// If our index.html changes, reload browser.
// 	gulp.watch('temp/index.html', { cwd: __dirname }).on('change', bs.reload)

// })

// gulp.task('serve', function() {

// 	let cssProxy = url.parse('https://www.bostonglobe.com/css')
// 	cssProxy.route = '/css'

// 	let jsProxy = url.parse('https://www.bostonglobe.com/js')
// 	jsProxy.route = '/js'

// 	let rwProxy = url.parse('https://www.bostonglobe.com/rw')
// 	rwProxy.route = '/rw'

// 	let rfProxy = url.parse('https://www.bostonglobe.com/rf')
// 	rfProxy.route = '/rf'

// 	bs.init({
// 		server: {
// 			baseDir: path.join(__dirname, 'temp'),
// 			index: 'index.html',
// 			middleware: [
// 				proxy(cssProxy),
// 				proxy(jsProxy),
// 				proxy(rwProxy),
// 				proxy(rfProxy),
// 			],
// 		},
// 		notify: false,
// 	})
// })

gulp.start('default')