import chalkTemplate from 'chalk-template'
import frontMatter from 'front-matter'
import fs from 'fs-extra'
import merge from 'lodash.merge'
import { marked } from 'marked'
import { basename, extname, resolve } from 'path'
import { fail } from './logger.js'

/**
 * Extract front-matter and render markdown returning
 * object with data, file content and boolean whether
 * some attributes are present in current data or not
 *
 * @param {string} file
 * @param {Object} data
 *
 * @returns {Promise<Object>} file
 */
export default async (file, data) => {
  const isMarkdown = /\.md|\.mdown|\.markdown/.test(extname(file))
  try {
    const content = await fs.readFile(resolve(file), 'utf8')
    const fm = frontMatter(content)
    return {
      source: file,
      data: merge({}, data, { page: fm.attributes }),
      content: isMarkdown ? marked.parse(fm.body) : fm.body,
      haveAttributes: Object.keys(fm.attributes).length,
    }
  } catch (err) {
    return fail(chalkTemplate`Failed to read {yellow ${basename(file)}}`, err)
  }
}
