import chalkTemplate from 'chalk-template'
import { Environment, FileSystemLoader } from 'nunjucks'
import { basename } from 'path'
import preferLocal from 'prefer-local'
import injectData from './inject-data.js'
import injectLayout from './inject-layout.js'
import { fail } from './logger.js'

/**
 * Wrap an extends tag and a content block around and render
 * nunjucks template and return a Promise resolves to an object
 * with file path and rendered content
 *
 * @param {string} source
 * @param {object} opts
 *
 * @returns {Promise}
 */
export default async (source, opts) => {
  const compiler = new Environment(new FileSystemLoader(opts.templates))
  try {
    const file = injectLayout(await injectData(source, opts.data), opts.block)
    return new Promise((resolve, reject) => {
      compiler.renderString(file.content, file.data, (err, content) => {
        if (err) {
          reject(err)
        }
        resolve({
          path: source,
          content,
          isClean: preferLocal(file.data, 'page.clean', opts.clean),
        })
      })
    })
  } catch (err) {
    return fail(
      chalkTemplate`Error rendering {yellow ${basename(source)}}`,
      err
    )
  }
}
