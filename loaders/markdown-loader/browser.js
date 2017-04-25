/* eslint-disable no-console, func-names */
const frontMatter = require('front-matter')
const markdownIt = require('markdown-it')
const hljs = require('highlight.js')
const objectAssign = require('object-assign')
const string = require('string')

const { linkPrefix } = { linkPrefix: '/' }

const highlight = function (str, lang) {
  if ((lang !== null) && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, str).value
    } catch (_error) {
      console.error(_error)
    }
  }
  try {
    return hljs.highlightAuto(str).value
  } catch (_error) {
    console.error(_error)
  }
  return ''
}

function createTOC (tocItems) {
  let lastLevel = 0
  let htmlArray = tocItems.map(({ level, text, slug }, i) => {
    const isDropdown = tocItems[i+1]?tocItems[i+1].level>level:false
    let html = ''

    if (level > lastLevel) {
      html += '<ul class="dropdown-menu">'
      if (level>lastLevel+1) html+='<li class="dropdown"><ul class="dropdown-menu">'.repeat(level-lastLevel-1)
    } else {
      html += '</li></ul>'.repeat(lastLevel - level)
      html += '</li>'
    }
    lastLevel = level

    return `${html}<li class="${isDropdown?'dropdown':''}">\n<a class="${isDropdown?'dropdown-toggle':''}" href="#${slug}">${text}</a>\n`
  }).join('')

  htmlArray += '</li></ul>'.repeat(lastLevel)
  htmlArray = htmlArray.slice(26, -5)

  return htmlArray
}

const tocItems = []
/* eslint-disable no-param-reassign */
function permalink (md) {
  md.renderer.rules.heading_open = (tokens, index) => {
    tocItems.push({
      level: tokens[index].tag[1],
      text: tokens[index+1].content,
      slug: string(tokens[index+1].content).slugify().toString(),
    })
    return `<${tokens[index].tag}><a id="${string(tokens[index+1].content).slugify().toString()}"></a><a class="permalink" href="#${string(tokens[index-1].content).slugify().toString()}"><span class="glyphicon glyphicon-link"></span></a>`
  }
  md.renderer.rules.heading_close = (tokens, index) => `</${tokens[index].tag}>`
}
/* eslint-enable no-param-reassign */

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight,
  replaceLink: (link) => {
    let prefixed = link
    if (!/^(https?:\/\/|\/\/)/.test(link) && process.env.NODE_ENV === 'production') {
      prefixed = link.startsWith('/') ? `${linkPrefix}${link}` : link
    }
    return prefixed
  },
})
.use(require('markdown-it-container'), // plugin
  'foobar', // plugin param1, mandatory
  { // plugin param2
    validate: name => name.trim().length, // allow everything not empty (by i don't recommend)
    render: (tokens, idx) => {
      const m = tokens[idx].info.trim()
      if (tokens[idx].nesting === 1) {
        return `<div class="${md.utils.escapeHtml(m)}">\n`
      }
      return '</div>\n'
    },
  })
  .use(require('markdown-it-replace-link'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-header-sections'))
  .use(require('markdown-it-attrs'))
  .use(permalink)

module.exports = function (content) {
  const meta = frontMatter(content)
  const body = md.render(meta.body)
  const toc = createTOC(tocItems.slice())
  const result = objectAssign({}, meta.attributes, {
    body, toc,
  })
  tocItems.length = 0
  return result
}
