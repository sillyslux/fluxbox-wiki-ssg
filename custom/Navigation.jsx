/* global window */
import React, { Component } from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import Headroom from 'react-headroom'
import { Navbar, Nav, NavItem, InputGroup, Button, Glyphicon, FormGroup, FormControl } from 'react-bootstrap-externaljs'
import LinkContainer from 'react-router-bootstrap/lib/LinkContainer'
import getPageProps from 'utils/pageInfo'
import PropTypes from 'prop-types'

import 'css/headroom.sass'
import 'css/navbar.sass'
import 'css/subnav-animation.sass'

import LanguageMenu from './LanguageMenu'

const NavItemRouted = item => (
  <LinkContainer to={item.link}>
    <NavItem eventKey={item.link}>{item.text}</NavItem>
  </LinkContainer>
)

export default class Navigation extends Component {
  render () {
    const { language } = getPageProps(this.props.location.pathname)
    return (
      <Headroom>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={prefixLink('/')} className="text-muted">
                fluxbox<span className="navbar-logo" />wiki
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Form pullRight>
              <FormGroup bsSize="sm" id="duck-search">
                <InputGroup bsSize="sm" className="animated-input slideUp">
                  <FormControl type="text" />
                </InputGroup>
                <Button bsStyle="primary" bsSize="sm">
                  <Glyphicon glyph="search" />
                </Button>
              </FormGroup>
            </Navbar.Form>
            <Nav bsStyle="pills" pullRight>
              <NavItemRouted link={prefixLink(`/${language}/wiki/`)} text="Users" />
              <NavItemRouted link={prefixLink(`/${language}/devel/`)} text="Developers" />
              <LanguageMenu location={this.props.location} />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Headroom>
    )
  }
}

Navigation.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
}
