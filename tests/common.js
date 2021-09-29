const baseOpts = {
  rootPaths: ['tests/fixtures/'],
  minify: false,
  block: true,
  out: 'dist',
}

const renderOpts = {
  data: {},
  block: true,
  templates: ['tests/fixtures'],
}

const minifyOpts = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  keepClosingSlash: true,
  sortAttributes: true,
  sortClassName: true,
}

const resultInput = [
  Promise.resolve('dist/prose/index.html'),
  Promise.resolve('dist/about/index.html'),
  Promise.resolve('dist/blog/index.html'),
]

export { baseOpts, renderOpts, minifyOpts, resultInput }
