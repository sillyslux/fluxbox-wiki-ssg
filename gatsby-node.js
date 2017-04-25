const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')
const async = require('async')
const parsePath = require('parse-filepath')

const debug = require('debug')('gatsby:post-build')

const isdir = filePath => new Promise((resolve, reject) => {
  fs.stat(filePath, (err, stats) => (err ? reject(err) : resolve(stats.isDirectory())))
})
const copy = (source, target) => new Promise((resolve, reject) => {
  fs.copy(source, target, err => (err ? reject(err) : resolve('success')))
})
const globP = (globString, options) => new Promise((resolve, reject) => {
  glob(globString, options, (err, files) => (err ? reject(err) : resolve(files)))
})

exports.postBuild = function postBuild (pages, callback) {
  debug('copying files to target directories')
  const processFile = (file, cb) => {
    isdir(file).then((dir) => {
      if (dir) return cb(null, [])
      const filename = parsePath(file).basename
      const relativePath = path.relative(`${__dirname}/pages`, file)
      const relativeDir = parsePath(relativePath).dirname
      let targetPages
      if (relativeDir.startsWith('../static')) {
        targetPages = [copy(file, path.join(__dirname, 'public', parsePath(path.relative(`${__dirname}/static`, file)).path))]
      } else if (relativeDir!=='') {
        targetPages = pages.filter(p => p.file.dirname === relativeDir)
        .map(p => path.join(parsePath(p.path).path, filename))
        .map(p => path.join(__dirname, 'public', p))
        .map(p => copy(file, p))
      } else {
        targetPages = []
      }
      return Promise.all(targetPages).then(res => cb(null, res), err => cb(err))
    }, err => cb(err))
  }

  const assetTypes = '!(*.js|*.jsx|*.md)'
  const globString = `${__dirname}/pages/**/${assetTypes}`
  Promise.all([
    globP(globString, { follow: true }),
    globP(`${__dirname}/static/**/*`, { follow: true }),
  ]).then(files => async.map([].concat(...files), processFile, error => callback(error)))
}
