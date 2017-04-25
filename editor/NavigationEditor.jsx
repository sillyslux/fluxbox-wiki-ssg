/* global window, document, localStorage */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navbar, Button, Modal, OverlayTrigger, Glyphicon, Tooltip, FormGroup, FormControl, ControlLabel, Nav } from 'react-bootstrap-externaljs'
import * as octicons from 'octicons'
import styles from '../css/nav-edit.module.sass'
import { GitHubClient } from './GitHubClient'

const OctIcon = (path, { class: className, ...options }) => <svg
  className={className}
  {...options}
  dangerouslySetInnerHTML={{ __html: path }}
/>

const tooltip = hint => (
  <Tooltip id="tooltip">
    {{
      diff: 'Show changes',
      eye: 'Show live preview in Browser',
      tools: 'Show Tools',
    }[hint]||hint}
  </Tooltip>
)
const icons = (scope, names) => names.map(iconName => (
  <OverlayTrigger placement="bottom" overlay={tooltip(iconName)}>
    <Button bsStyle="primary" bsSize="sm" onClick={scope.open}>
      { OctIcon(octicons[iconName].path, octicons[iconName].options) }
    </Button>
  </OverlayTrigger>
))
// debugger

const ghc = token => new GitHubClient({ token, baseUri: 'https://api.github.com' })

// githubCliDotCom.getData({ path: '/user' })
//   .then((response) => {
//     console.log(response)
//     user = (
//       <div style={{
//         backgroundImage: 'url(${response.data.avatar_url})',
//         height: '100px',
//         width: '100px',
//       }} />
//     )
//     // debugger
//     // console.log(response.data.each(obj=>obj.name!=='fluxbox-wiki-editor'))
//   })

const getIcon = (scope, details) => {
  let icon = null
  if (octicons[details[0]]) {
    icon = (
      <OverlayTrigger placement="bottom" overlay={tooltip(details[1])}>
        <Button bsStyle="primary" bsSize="sm" onClick={scope.open}>
          { OctIcon(octicons[details[0]].path, octicons[details[0]].options) }
        </Button>
      </OverlayTrigger>
    )
  }
  return icon
}

function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}
function receiveFromOpener(){}

class EditorNav extends Component {
  constructor(props) {
    document.body.className = 'editor'
    super(props)
    this.state = {
      showModal: false,
      token: '',
      userName: '',
      avatarUrl: '',
      login: 0,
      sufficientPerms: 0,
    }
  }
  getValidationState () {
    return [null, 'warning', 'success', 'error'][this.state.login]
  }

  close() {
    this.setState({ showModal: false })
  }

  getIcon (details) {
    let icon = null
    if (octicons[details[0]]) {
      icon = (
        <OverlayTrigger key={`icon-${details[0]}`} placement="bottom" overlay={tooltip(details[1])}>
          <Button bsStyle="primary" bsSize="sm" onClick={(e) => this.open(e)}>
            { OctIcon(octicons[details[0]].path, octicons[details[0]].options) }
          </Button>
        </OverlayTrigger>
      )
    }
    return icon
  }

  open() {
    console.log('show modal', this)
    this.setState({ showModal: true })
  }
  componentDidMount () {
    const savedToken = localStorage.getItem('gh-api-key')||''
    this.setState({ token: savedToken, login: savedToken?1:0 }, this.getUserInfo)
    // document.head.appendChild(diff)
    // const editor = document.createElement('script')
    // editor.src = '//fluxbox-wiki.dev.lncr/static/editor.js'
    // document.head.appendChild(editor)
    // window.opener.postMessage('getFilename', 'http://localhost:8000')
  }
  save () {
    console.log('save')
  }
  enableLive () {
    window.addEventListener('keydown', debounce(
      () => window.opener.postMessage({ md: document.querySelector('#display').textContent }, 'http://localhost:8000'),
      250,
    ))
  }
  getUserInfo () {
    if (this.state.token) {
      ghc(this.state.token).getData({ path: '/user' })
      .catch(err => this.setState({ login: 3 }))
      .then(response => this.setState({ userName: response.data.login, avatarUrl: response.data.avatar_url, login: 2 }, this.checkPermissions))
    } else {
      this.setState({ login: 0 })
    }
  }
  checkPermissions () {
    ghc(this.state.token).getData({ path: '/user/repos' })
    .then(res => console.log(res))
    ghc(this.state.token).postData({ path: '/repos/sillyslux/fluxbox-wiki/forks' })
    .catch(err => console.log(err))
    .then(res => console.log(res))
  }
  handleChange (e) {
    localStorage.setItem('gh-api-key', e.target.value)
    this.setState({ token: e.target.value, login: 1 }, this.getUserInfo)
  }
  deleteToken (e) {
    e.preventDefault()
    localStorage.removeItem('gh-api-key')
    this.setState({ token: '', login: 0 })
  }
  render () {
    const tooltip = (
      <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
    )
    const user = this.state.userName ? (
      <div className='userInfo'>
        <div className='avatar' style={{ backgroundImage: `url(${this.state.avatarUrl})` }} />
        <span className='userName'>{this.state.userName}</span>
        <hr />
      </div>
    ) : null
    // <div className={process.env.NODE_ENV === 'production' ? 'navEdit' : `${styles.navEdit} navEdit`}>
    return (
      <div className="navEdit">
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              fluxbox<span className="navbar-logo" />wiki
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            {[
              ['user', 'you need to provide an github access token'],
              ['magnet', 'tesicon'],
            ].map(name => this.getIcon(name))}
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Github User</Tooltip>}>
              <Button bsStyle="primary" bsSize="sm">
                <Glyphicon glyph="user" />
              </Button>
            </OverlayTrigger>
          </Nav>
        </Navbar>

        <Modal show={this.state.showModal} onHide={e => this.close(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Fluxbox-Wiki Github Editor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup
              controlId="formBasicText"
              validationState={this.getValidationState()}
            >
              {user}
              <h4>
                <ControlLabel>

                  {[
                    'To enable the editor, you need to paste a github access token below.',
                    'validating...',
                    <span>Access Token, to delete click <a href="#deleteToken" onClick={e => this.deleteToken(e)}>here</a>.</span>,
                    'This Token is invalid, please enter an other one.',
                  ][this.state.login]}
                </ControlLabel>
              </h4>
              <div className="tokenInput">
                <FormControl
                  type="text"
                  value={this.state.token}
                  placeholder="Enter text"
                  onChange={e => this.handleChange(e)}
                />
                <FormControl.Feedback>
                  {[
                    '',
                    <Glyphicon glyph="transfer" />,
                    <Glyphicon glyph="ok" />,
                    <Glyphicon glyph="remove" />,
                  ][this.state.login]}
                </FormControl.Feedback>
              </div>
            </FormGroup>
            <p>This token is saved in your browser and only ever transmitted to the host <code>api.github.com</code>. To create your access token, go <a href="https://github.com/settings/tokens">here</a> and don&lsquo;t forget to enable repo access.</p>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

EditorNav.propTypes = {}

export default EditorNav

// <Button bsStyle="primary" bsSize="sm">
//   <Glyphicon glyph="search" onClick={this.save} />
// </Button>
// {icons(this, ['tools'])}
// <Button bsStyle="primary" bsSize="sm">
//   { OctIcon(octicons['repo-forked'].path, octicons['repo-forked'].options) }
// </Button>
// <Button bsStyle="primary" bsSize="sm">
//   { OctIcon(octicons['git-branch'].path, octicons['git-branch'].options) }
// </Button>
// <OverlayTrigger placement="bottom" overlay={tooltip('eye')}>
//   <Button bsStyle="primary" bsSize="sm" onClick={this.enableLive}>
//     { OctIcon(octicons.eye.path, octicons.eye.options) }
//   </Button>
// </OverlayTrigger>
// <OverlayTrigger placement="bottom" overlay={tooltip('diff')}>
//   <Button bsStyle="primary" bsSize="sm" onClick={this.enableLive}>
//     { OctIcon(octicons.diff.path, octicons.diff.options) }
//   </Button>
// </OverlayTrigger>
