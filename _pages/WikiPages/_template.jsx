import React, { Component } from 'react'
import PropTypes from 'prop-types'
import pageInfo from 'utils/pageInfo'
import styles from 'css/wiki-page.module.sass'
import { Nav, Panel, Grid, Col, Row } from 'react-bootstrap-externaljs'
import 'css/toc.sass'

export default class WikiPage extends Component {
  render () {
    const { page } = pageInfo(this.props.location.pathname)

    return (
      <Grid className={styles['wiki-page']}>
        <Row>
          <Panel>
            <Col md={9}>
              {this.props.children}
            </Col>
            <Col bsClass="sidebar sidebar-right col" md={3}>
              <Nav
                id="spytoc"
                bsStyle="pills"
                stacked
                dangerouslySetInnerHTML={{ __html: page.data.toc }}
                data-spy="affix"
                data-offset-bottom="120"
                data-offset-top="38"
              />
            </Col>
          </Panel>
        </Row>
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
