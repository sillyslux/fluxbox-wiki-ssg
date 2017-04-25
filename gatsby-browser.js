/* global window, document, ScrollSpy */
/* eslint-disable no-new */

import { prefixLink } from 'gatsby-helpers'
import pageInfo from 'utils/pageInfo'
import md from 'loaders/markdown-loader/browser'

import { ScrollSpy, Affix } from './static/bootstrap-native.min.js'

const checkPath = (paths, location) => ![].every.call(
  (Array.isArray(paths) && paths) || [paths],
  path => ![path, prefixLink(path)].includes(location),
)

const pageTocUpdate = () => {
  delete document.body.ScrollSpy
  if (document.querySelector('#spytoc')) {
    new ScrollSpy(document.body, {
      target: document.querySelector('#spytoc'),
      offset: 80,
    }).refresh()
    new Affix(document.getElementById('spytoc'))
  }
}

let editorWindow

const sendToEditor = {
  reconnect: (msg) => {
    editorWindow = msg.source
  },
  pageData: () => {

  },
}
const receiveFromEditor = {

}

let onRouteUpdate = () => {}

if (typeof document !== 'undefined' && process.env.NODE_ENV === 'development') {
  onRouteUpdate = (route) => {
    if (checkPath(['/iframe/', '/editor/'], route.pathname)) {
      return
    }
    if (editorWindow) editorWindow.postMessage(pageInfo(route.pathname), 'http://localhost:8000')
    window.onmessage = (msg) => {
      if (msg.data==='getFilename') {
        editorWindow=msg.source
        editorWindow.postMessage(pageInfo(route.pathname), 'http://localhost:8000')
        return
      }
      const obj = md(msg.data.md)
      document.querySelector('.markdown-container').innerHTML = obj.body
      if (document.querySelector('#spytoc')) {
        document.querySelector('#spytoc').innerHTML = obj.toc
        pageTocUpdate()
      }
    }
    window.onunload = () => {
      if (editorWindow) editorWindow.postMessage('reconnect', 'http://localhost:8000')
    }
    pageTocUpdate()
  }
}

exports.onRouteUpdate = onRouteUpdate
