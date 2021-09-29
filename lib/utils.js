import fs from 'fs-extra'
import { globbySync } from 'globby'
import { dirname, resolve } from 'path'
import { gzipSync } from 'zlib'
import { warn } from './logger.js'

/**
 * Type of paths passed as arguments
 * @type {object}
 */
const pathtype = {
  SOURCES: 'sources',
  TEMPLATES: 'templates',
}

/**
 * Filter all existing files
 * @param  {object} files files to be added
 * @param  {string} pathtype  pathtype of files for logging
 * @return {object}       filtered list
 */
const getExisting = (files, pathtype) => {
  if (files && files.length) {
    return files.map((file) => resolve(file)).filter(fs.existsSync)
  } else {
    warn(`Using current directory for ${pathtype}`)
    return [process.cwd()]
  }
}

/**
 * Check if a file is inside one of the folders of a list
 * @param  {string} file file to check existence
 * @param  {object} list list of paths to look inside
 * @return {string}      path containing file
 */
const isInside = (file, list) => {
  const _file = resolve(file)
  let parent = false
  list.forEach((item) => {
    if (_file.includes(item)) {
      parent = parent && item.includes(parent) ? parent : item
    }
  })
  return parent
}

/**
 * Calculate and return gzip size of a file
 * @param {string} file file to compress
 *
 * @return {number}  gzip size
 */
const gzipSize = (file) => {
  try {
    const content = fs.readFileSync(file, 'utf8')
    const gzip = gzipSync(content)
    return gzip.length
  } catch (e) {
    return 0
  }
}

/**
 * Convert gzip file size to human readable format
 * @param  {string} file file to calculate size for
 * @return {string}      human readable size
 */
const humanSize = (file) => {
  const size = gzipSize(file)
  if (size >> 20) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }
  if (size >> 10) {
    return `${(size / 1024).toFixed(2)} KB`
  }
  return `${size} B`
}

/**
 * convert time difference of `process.hrtime` to human readable time
 * @param  {object} td time difference of `process.hrtime`
 * @return {string}    human readable time
 */
const humanTime = (td) => {
  if (td[0]) {
    return `${(td[0] + td[1] / 1e9).toFixed(2)}s`
  }
  return `${(td[1] / 1e6).toFixed(2)}ms`
}

/**
 * Check if given path is is a file
 * @param {string} f path
 */
const isFile = (f) => fs.lstatSync(f).isFile()

/**
 * Check if given path is is a directory
 * @param {string} f path
 */
const isDirectory = (f) => fs.lstatSync(f).isDirectory()

/**
 * Get all files and their parent directories
 * from arguments passed
 * @param {string} args cli arguments to parse
 *
 * @return {[files, rootPaths]} args
 */
const getPaths = (args) => {
  const files = getExisting(
    globbySync(args, { absolute: true }),
    pathtype.SOURCES
  )
  const rootPaths = files.map((f) => (isDirectory(f) ? f : dirname(f)))
  return [files, rootPaths]
}

/**
 *  Get template paths from template argument
 * @param {string} template
 *
 * @return {Array} template paths
 */
const getTemplates = (template) => {
  return getExisting(
    globbySync(template, { absolute: true }),
    pathtype.TEMPLATES
  ).map((f) => (isDirectory(f) ? f : dirname(f)))
}

export {
  pathtype,
  getExisting,
  isInside,
  gzipSize,
  humanSize,
  humanTime,
  isFile,
  isDirectory,
  getPaths,
  getTemplates,
}
