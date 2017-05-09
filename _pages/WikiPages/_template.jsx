/* global localStorage */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getPageProps from 'utils/pageInfo'
import styles from 'css/wiki-page.module.sass'
import { Nav, Panel, Grid, Col, Row, OverlayTrigger, Button, Glyphicon, Tooltip } from 'react-bootstrap-externaljs'
import 'css/toc.sass'

export default class WikiPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showToc: true,
    }
  }

  componentDidMount () {
    const oldState = JSON.parse(localStorage.getItem('showToc'))
    this.setState({ showToc: oldState===null ? true : oldState })
  }

  toggleToc () {
    localStorage.setItem('showToc', !this.state.showToc)
    this.setState({ showToc: !this.state.showToc })
  }

  render () {
    const { page } = getPageProps(this.props.location.pathname)

    return (
      <Grid className={styles['wiki-page']}>
        <Row>
          <Panel>
            <Col md={this.state.showToc ? 9 : 12}>
              {this.props.children}
            </Col>
            <Col className={this.state.showToc ? '' : 'hideToc'} bsClass="sidebar sidebar-right col" md={3}>
              <Nav
                id="spytoc"
                bsStyle="pills"
                stacked
                dangerouslySetInnerHTML={{ __html: page.data.toc }}
                data-spy="affix"
                data-offset-bottom="120"
                data-offset-top="38"
              />
              <OverlayTrigger container={this.tocButton} placement="left" delayShow={1000} overlay={<Tooltip id="user-menu">{this.state.showToc ? 'hide' : 'show'}<br />Table of Contents</Tooltip>}>
                <Button bsStyle="link" bsSize="sm" onClick={e => this.toggleToc(e)} ref={(c) => { this.tocButton = c }}>
                  <Glyphicon glyph={this.state.showToc ? 'eye-close' : 'menu-hamburger'} />
                </Button>
              </OverlayTrigger>
            </Col>
          </Panel>
        </Row>
        {page.data.git ?
          <Row className="modInfo">
            <Col
              xs={12}
              dangerouslySetInnerHTML={{ __html: `
                Last modified: <a href="//github.com/sillyslux/fluxbox-wiki/commit/${page.data.git.commit}#${page.data.git.fsha}">${page.data.git.author}</a> (${page.data.git.date})
              ` }}
            />
          </Row>
        : null }
      </Grid>
    )
  }
}

WikiPage.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}
