import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { prefixLink } from 'gatsby-helpers'
import getPageProps from 'utils/pageInfo'

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
    const { page } = getPageProps(this.props.location.pathname)
    const modInfo = page.data.git ? <div style={{ textAlign: 'right' }} dangerouslySetInnerHTML={{ __html: `Last modified: <a href="//github.com/sillyslux/fluxbox-wiki/commit/${page.data.git.commit}#${page.data.git.fsha}">${page.data.git.author}</a> (${page.data.git.date})` }} /> : null
    return (
      <div className="react-root">
        {popup || <Navigation location={this.props.location} />}
        {this.props.children}
        {modInfo}
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
