import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { prefixLink } from 'gatsby-helpers'

import Navigation from 'custom/Navigation'
import Footer from 'custom/Footer'

import 'css/global-style'


const checkPath = (paths, location) => ![].every.call(
  (Array.isArray(paths) && paths) || [paths],
  path => ![path, prefixLink(path)].includes(location),
)

export default class BaseTemplate extends Component {
  render () {
    const popup = checkPath(['/chat/', '/editor/'], this.props.location.pathname)
    return (
      <div className="react-root">
        {popup || <Navigation location={this.props.location} />}
        {this.props.children}
        {popup || <Footer location={this.props.location} />}
      </div>
    )
  }
}

BaseTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}
