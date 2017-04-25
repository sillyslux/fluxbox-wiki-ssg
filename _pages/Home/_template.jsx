import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Grid, Row } from 'react-bootstrap-externaljs'

import styles from 'css/home.module'

export default class HomePage extends Component {
  render () {
    return (
      <Grid className={styles.home}>
        <Row>
          {this.props.children}
        </Row>
      </Grid>
    )
  }
}

HomePage.propTypes = {
  children: PropTypes.node.isRequired,
}
