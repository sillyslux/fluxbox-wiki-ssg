import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap-externaljs'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { pages } from 'config'
import pageInfo from 'utils/pageInfo'

import styles from 'css/pageindex.module'


export default class PageIndex extends Component {
  render () {
    const { language } = pageInfo(this.props.location.pathname)

    // find all pages in /pages/WikiPages
    const indexedPages = pages.filter(a => /WikiPages\/.+\/.?/.test(a.requirePath)&&a.file.name===language).sort((a, b) => a.data.title > b.data.title)

    let index = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({ letter, pages: [] }))

    // alphabetically group pages
    indexedPages.forEach(p => index[p.data.title[0].toLowerCase().charCodeAt(0)-97].pages.push(p))

    // build anchor-links to pagelink-groups
    const anchorLinks = index.map(i => (i.pages.length ?
      <a key={i.letter} href={`#${i.letter}`}>{i.letter}</a>
    :
      <span key={i.letter} style={{ opacity: 0.3 }}>{i.letter}</span>
    ))

    // filter empty groups from index
    index = index.filter(letter => letter.pages.length)

    return (
      <Panel header={anchorLinks} className={styles.pageindex}>
        {index.map(letterGroup =>
          <Panel header={<h4 id={letterGroup.letter}>{letterGroup.letter}</h4>}>
            <ListGroup>
              {letterGroup.pages.map(page =>
                <ListGroupItem>
                  <Link to={prefixLink(page.path)}>
                    {page.data.title}
                  </Link>
                </ListGroupItem>,
              )}
            </ListGroup>
          </Panel>,
        )}
      </Panel>
    )
  }
}

PageIndex.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}
