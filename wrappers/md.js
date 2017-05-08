import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { config, pages } from 'config'
import { prefixLink } from 'gatsby-helpers'

import style from 'css/markdown.module.sass'

export default class Markdown extends Component {
  render () {
    const post = this.props.route.page.data
    post.body = post.body.replace(/href="([^"]+)"/g, (attr, link) => {
      const hashed = link.match(/(.+)#(.+)/)
      const path = (hashed && hashed[1]) || link
      const page = pages.find(p =>
        p.requirePath === path ||
        p.path === path ||
        (p.requirePath && prefixLink(p.requirePath) === path) ||
        (p.path && prefixLink(p.path) === path)
      )
      let fixedLink = page && page.path
      fixedLink = fixedLink && (hashed ? `href="${prefixLink(fixedLink)}#${hashed[2]}"` : `href="${prefixLink(fixedLink)}"`)
      return fixedLink || attr
    })
    return (
      <div className={`${style['markdown-container']} markdown-container`}>
        <Helmet
          title={`${post.title} - ${config.siteTitle}`}
        />
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    )
  }
}

Markdown.propTypes = {
  route: PropTypes.shape({
    page: PropTypes.shape({
      data: PropTypes.shape({
        body: PropTypes.string,
      }),
    }),
  }).isRequired,
}
