/* eslint max-len: ["error", 110] */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Grid, Col, Nav, NavItem } from 'react-bootstrap-externaljs'
import { LinkContainer } from 'react-router-bootstrap'
import { prefixLink } from 'gatsby-helpers'
import { pages } from 'config'
import pageInfo from 'utils/pageInfo'
import PageIndex from 'custom/PageIndex'

import styles from 'css/wiki-portal.module'

const NavItemRouted = item => (
  <LinkContainer to={item.link}>
    <NavItem eventKey={item.link}>{item.text}</NavItem>
  </LinkContainer>
)


export default class WikiPortal extends Component {
  render () {
    const { page, language } = pageInfo(this.props.location.pathname)

    const navPages = {}
    const regex = new RegExp(`^WikiPortal/.+/${language}.md`)
    pages.filter(a => regex.test(a.requirePath))
      .forEach((p) => {
        const name = p.requirePath.split('/')[1]
        navPages[name] = { path: p.data.path, title: p.data.title }
      })

    return (
      <Grid className={styles.wikiPortal}>
        <Col xs={3} lg={2} className="sidebar">
          <Nav id="wiki-portal-navigation" bsStyle="pills" stacked>
            <NavItemRouted link={prefixLink(navPages.Entry.path)} text={navPages.Entry.title} />
            <NavItemRouted link={prefixLink(navPages.Index.path)} text={navPages.Index.title} />
            <NavItemRouted link={prefixLink(navPages.About.path)} text={navPages.About.title} />
            <NavItemRouted link={prefixLink(navPages.Contribute.path)} text={navPages.Contribute.title} />
            <NavItemRouted link={prefixLink(navPages.GettingHelp.path)} text={navPages.GettingHelp.title} />
          </Nav>
        </Col>
        <Col xs={9} lg={10} className="content">
          {this.props.children}
          {page.file.dir === 'WikiPortal/Index' ? <PageIndex location={this.props.location} /> : ''}
        </Col>
      </Grid>
    )
  }
}

WikiPortal.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}
