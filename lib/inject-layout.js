const path = require('path')
const chalk = require('chalk')
const preferLocal = require('prefer-local')

/**
 * Detect correct template to extend for the file and
 * whether to wrap file in a block or use it directly
 * and return file with ready to render template data
 *
 * @param {Object} file
 * @param {Object} block
 *
 * @returns {Object} file
 */
module.exports = (file, block) => {
  if (preferLocal(file.data, 'page.layout')) {
    const canUseBlock = preferLocal(file.data, 'page.block', block)
    let layoutFile = file.data.page.layout
    layoutFile = !path.extname(layoutFile)
      ? layoutFile.concat('.njk')
      : layoutFile
    const extendLayout = `{% extends "${layoutFile}" %}`
    const extendBlock = `{% block content %}${file.content}{% endblock %}`
    file.content = `${extendLayout} ${canUseBlock ? extendBlock : file.content}`
  } else if (file.haveAttributes) {
    // file have front-matter but no layout property is found
    throw Error(
      chalk`No layout declared in for {yellow ${path.basename(file.source)}}`
    )
  }
  return file
}
