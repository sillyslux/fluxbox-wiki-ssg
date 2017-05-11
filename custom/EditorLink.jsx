/* global window */
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { prefixLink } from 'gatsby-helpers'


export default class EditorLink extends Component {
  openEditWindow (evt) {
    evt.preventDefault()
    window.open(
      '/editor/',
      'EditorWindow',
      'toolbar=no,menubar=no,titlebar=no,height=600,width=800',
    )
  }

  render () {
    return (
      <a
        style={this.props.style ? this.props.style : null}
        href={prefixLink('/editor/')}
        onClick={this.openEditWindow}
      >
        {this.props.children}
      </a>
    )
  }
}

EditorLink.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.shape({}),
}

EditorLink.defaultProps = {
  style: {},
}
