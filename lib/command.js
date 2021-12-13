import chalkTemplate from 'chalk-template'
import { watch as _watch } from 'chokidar'
import { Command } from 'commander'
import { extname, relative } from 'path'
import getData from './get-data.js'
import { log } from './logger.js'
import api from './main.js'
import { getPaths, getTemplates, isInside } from './utils.js'

/**
 * Setup and run program with given arguments
 */
export default async (args) => {
  const program = new Command()
  program
    .storeOptionsAsProperties()
    .name('njk')
    .arguments('<files|dirs|globs>')
    .usage(chalkTemplate`{green <files|dirs|globs>} [options]`)
    .option('-v, --verbose', 'print additional log')
    .option('-b, --block', 'wrap a content block in files')
    .option('-c, --clean', 'use clean urls for output files')
    .option('-q, --quiet', 'silence output until error occurs')
    .option('-w, --watch', 'watch for file changes\n')
    .option('-d, --data <file|dir>', 'JSON data or JSON/yaml directory')
    .option(
      '-t, --template <dirs>',
      'Template directories (same as searchPaths)\n',
      (t) => t.split(',')
    )
    .option('-o, --out <dir>', 'Output directory', 'dist')

  program.parse(args, { from: 'user' })

  const [files, rootPaths] = getPaths(program.args)
  const templates = getTemplates(program.template)

  const opts = {
    verbose: program.verbose,
    block: program.block,
    clean: program.clean,
    quiet: program.quiet,
    data: getData(program.data),
    rootPaths,
    templates,
    out: program.out,
    watch: program.watch,
    minify: !program.watch,
    minifyOpts: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      keepClosingSlash: true,
      sortAttributes: true,
      sortClassName: true,
    },
  }

  await api(files, opts)

  // list of files and directories to watch
  const watchList = []

  /* istanbul ignore next */
  if (program.watch) {
    watchList.push(...templates, ...rootPaths)
    // set up watcher and watch for file changes
    log('Running in watch mode')
    const watcher = _watch(watchList, {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
    })
    watcher.on('change', (file) => {
      if (isInside(file, templates)) {
        // if a template is changed render everything again
        log(
          chalkTemplate`Changed template {yellow ${relative(
            process.cwd(),
            file
          )}}`
        )
        api(files, opts)
      } else if (/\.njk|\.html|\.md|\.mdown|\.markdown/.test(extname(file))) {
        // if a file is changed render that file
        log(chalkTemplate`Changed {yellow ${relative(process.cwd(), file)}}`)
        api(file, opts)
      }
    })
  }
}
