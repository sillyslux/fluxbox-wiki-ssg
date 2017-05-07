/* global window, document, localStorage */
import React, { Component } from 'react'
import { prefixLink } from 'gatsby-helpers'
import { Grid } from 'react-bootstrap-externaljs'
import NavigationEditor from 'editor/NavigationEditor'
import { config } from 'config'
import { throttle, debounce } from 'utils/thdb'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import 'css/editor.global'

const domain = process.env.NODE_ENV === 'production' ? config.prodDomain : 'http://localhost:8000'

let callBack = () => {}


const sendToOpener = (data) => {
  console.log('sendotpener',data)
  window.opener.postMessage(data||'getFilename', domain)
  callBack()
}

const receiveFromOpener = (msg) => {
  console.log('editor receive', msg)
  if (msg.data==='reconnect') {
    callBack = throttle(sendToOpener, 500)
    console.log('start callr')
    callBack()
  }
  const text = r => r.text()
  if (msg.data.page) {
    callBack = () => {}
    doc = msg.data.page.requirePath
    // const draft = localStorage.getItem(msg.data.page.requirePath)
    if (draft) {
      console.log('set textContent draft')
      document.querySelector('#display').textContent = draft
      window.opener.postMessage({ md: document.querySelector('#display').textContent }, domain)

    }
    else fetch(`//fluxbox-wiki.dev.lncr/pages/${msg.data.page.requirePath}`).then(text).then((data) => {
      console.log('set textContent fetched')
      document.querySelector('#display').textContent = data
    })
  }
}

const bc = (msg) => {
  let connected = true
  const res = {
    reconnect: () => {
      connected = false
      setTimeout(() => !connected && sendToOpener('reconnect') && bc({ data: 'reconnect' }), 250)
    },
  }
  if (typeof msg.data === 'string') res[msg.data]()
}

const ttest = (arg1, arg2) => {
  console.log(arg1, arg2)

}
const ffire = throttle(ttest, 2500)
let doc = null

class Editor extends Component {
  componentDidMount () {
    document.body.className = 'editor'
    document.querySelector('.editPrimary').contentEditable = 'true'
    window.onmessage = receiveFromOpener
    this.sendToOpener('getFilename')
    ffire('arg1', 'arg2')
    this.enableLive()
  }
  sendToOpener (data) {
    console.log('sendotpener', callBack, data)
    window.opener.postMessage(data||'getFilenameping', domain)
  }
  save () {
    console.log('save')
  }
  enableLive () {
    window.addEventListener('keydown', debounce(
      () => {
        window.opener.postMessage({ md: document.querySelector('.editPrimary').textContent }, domain)
      },
      250,
    ))
  }

  render () {
    let nav
    let script
    if (process.env.NODE_ENV === 'production') {
      nav = <div className="editorNavigation" />
      script = [
        <script src={prefixLink('editor-bundle.js')} />,
        <link rel="stylesheet" href={prefixLink('editor.css')} />,
      ]
    } else {
      nav = <NavigationEditor location={this.props.location} doc={doc} />
    }

    return (
      <div>
        <Helmet
          title={`${config.siteTitle} | Editing: `}
        />
        {nav}
        <Grid className="editorContainer">
          <pre className="editPrimary" />
          <pre className="editSecondary" />
          <pre className="editDiff" />
        </Grid>
        {script}
      </div>
    )
  }
}

Editor.data = {
  title: 'Fluxbox-Wiki Editor',
  path: '/editor/',
}

Editor.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

export default Editor
