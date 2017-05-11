/* global window */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { modified } from 'i18n'
import getPageProps from 'utils/pageInfo'
import moment from 'moment'

import { Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap-externaljs'
import EditorLink from 'custom/EditorLink'
import OctIcon from 'custom/OctIcon'

import styles from 'css/modinfo.module.sass'


export default class ModInfo extends Component {
  render () {
    const { page, language } = getPageProps(this.props.location.pathname)
    moment.locale(language)
    const modDate = page.data.git ? moment(page.data.git.date, 'YYYY-MM-DD HH:mm:ss Z').format('LLLL') : null

    return page.data.git ? (
      <Row className={styles.modInfo}>
        <Col xs={12}>
          {modified[language]}
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip">{page.data.git.subject}</Tooltip>}
          >
            <a
              href={`//github.com/sillyslux/fluxbox-wiki/commits/${page.data.git.sha}/${page.requirePath}`}
            >
              {page.data.git.author}
            </a>
          </OverlayTrigger>
          {` ${modDate}`}
          <EditorLink>
            <OctIcon icon="pencil" size="m" style={{ margin: '0 -15px 0 4px' }} />
          </EditorLink>
        </Col>
      </Row>
    ) : null
  }
}

ModInfo.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}
