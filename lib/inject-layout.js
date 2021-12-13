import chalkTemplate from 'chalk-template'
import { basename, extname } from 'path'
import preferLocal from 'prefer-local'

/**
 * Detect correct template to extend for the file and
 * whether to wrap file in a block or use it directly
 * and return file with ready to render template data
 *
 * @param {Object} file
 * @param {boolean} block
 *
 * @returns {Object} file
 */
export default (file, block) => {
  if (preferLocal(file.data, 'page.layout')) {
    const canUseBlock = preferLocal(file.data, 'page.block', block)
    let layoutFile = file.data.page.layout
    layoutFile = !extname(layoutFile) ? layoutFile.concat('.njk') : layoutFile
    const extendLayout = `{% extends "${layoutFile}" %}`
    const extendBlock = `{% block content %}${file.content}{% endblock %}`
    file.content = `${extendLayout} ${canUseBlock ? extendBlock : file.content}`
  } else {
    // file have no layout property is found
    throw Error(
      chalkTemplate`No layout declared for {yellow ${basename(file.source)}}`
    )
  }
  return file
}
