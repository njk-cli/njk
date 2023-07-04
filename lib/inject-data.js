import chalkTemplate from 'chalk-template'
import fs from 'fs-extra'
import matter from 'gray-matter'
import merge from 'lodash.merge'
import { marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { mangle } from 'marked-mangle'
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
    const fm = matter(content)
    marked.use(mangle(), gfmHeadingId())
    return {
      source: file,
      data: merge({}, data, { page: fm.data }),
      content: isMarkdown ? marked.parse(fm.content) : fm.content,
      haveAttributes: Object.keys(fm.data).length,
    }
  } catch (err) {
    return fail(chalkTemplate`Failed to read {yellow ${basename(file)}}`, err)
  }
}
