/* eslint-disable no-console, func-names */
const frontMatter = require('front-matter')
const markdownIt = require('markdown-it')
const hljs = require('highlight.js')
const objectAssign = require('object-assign')
const string = require('string')
const { linkPrefix } = require('toml').parse(String(require('fs').readFileSync('./config.toml')))
// const nodegit = require('nodegit')
const sh = require('shelljs')
const path = require('path')
const toml = require('toml').parse

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
    return `<${tokens[index].tag}><a id="${string(tokens[index+1].content).slugify().toString()}"></a><a class="permalink" href="#${string(tokens[index+1].content).slugify().toString()}"><span class="glyphicon glyphicon-link"></span></a>`
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
  .use(require('markdown-it-replace-link'))
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-header-sections'))
  .use(require('markdown-it-attrs'))
  .use(permalink)

module.exports = function (content) {
  // let repo
  // console.log(__dirname, '../../pages/.git')
  // const getGitData = fpath => nodegit.Repository.open(
  // path.resolve(__dirname, '../../pages/.git'))
  // .then(r => {
  //   repo = r
  //   return repo.getBranchCommit('master')
  // })
  // .then((commit) => {
  //   const walker = repo.createRevWalk()
  //   walker.push(commit.sha())
  //   walker.sorting(nodegit.Revwalk.SORT.TIME)
  //
  //   return walker.fileHistoryWalk(fpath, 10)
  // })
  // .then(commitsPerFile => (commitsPerFile.length ? commitsPerFile[0].commit : null))

  this.cacheable()
  const callback = this.async()
  const meta = frontMatter(content)
  const body = md.render(meta.body)
  const toc = createTOC(tocItems.slice())
  const filename = this._module.rawRequest.slice(2) //eslint-disable-line
  tocItems.length = 0
  console.log('run', `git log -1 --pretty=format:sha=\\"%H\\"%nauthor=\\"%an\\"%ndate=\\"%ai\\"%nsubject=\\"%s\\"%nmsg=\\"%b\\"%n -- ${filename}`, path.resolve(__dirname, '../../pages-src'), __dirname, process.cwd())
  sh.exec(`git log -1 --pretty=format:sha=\\"%H\\"%nauthor=\\"%an\\"%ndate=\\"%ai\\"%nsubject=\\"%s\\"%nmsg=\\"%b\\"%n ${filename}`, {
    cwd: path.resolve(__dirname, '../../pages-src'),
    silent: true,
  }, (exit, stdout, stderr) => {
    if (stderr) console.warn(stderr)
    const commit = toml(stdout)
    const git = !stderr ? {
      sha: commit.sha,
      author: commit.author,
      msg: commit.msg,
      date: commit.date,
      subject: commit.subject,
    } : null
    const result = objectAssign({}, meta.attributes, {
      body, toc, git,
    })
    callback(null, `module.exports = ${JSON.stringify(result)}`)
  })

  // console.log(filename)
  // getGitData(filename)
  // .then((commit) => {
  //   if (!commit) return
  //   commit.repo = repo
  //   return commit.getEntry(filename).then(entry => ({ commit, entry }))
  // })
  // .then(({ commit, entry }) => {
  //   const git = commit ? {
  //     author: commit.author().name(),
  //     message: commit.message(),
  //     date: commit.date(),
  //     commit: commit.sha(),
  //     fsha: entry.sha(),
  //     fid: entry.id().tostrS(),
  //     foid: entry.oid(),
  //   } : null
  //   const result = objectAssign({}, meta.attributes, {
  //     body, toc, git,
  //   })
  //   callback(null, `module.exports = ${JSON.stringify(result)}`)
  // })
}
