import React, { Component } from 'react'
import PropTypes from 'prop-types'

import octicons from 'octicons'

import styles from 'css/octicon.module.sass'

const resize = {
  s: 0.75,
  m: 1,
  l: 1.5,
  xl: 2,
  xxl: 3,
}

export default class OctIcon extends Component {
  render () {
    const icon = octicons[this.props.icon]
    const option = icon.options

    return (
      <span
        className={styles.octicon}
        style={this.props.style ? this.props.style : null}
      >
        <svg
          className={option.class}
          height={option.height * resize[this.props.size]}
          width={option.width * resize[this.props.size]}
          viewBox={option.viewBox}
          aria-hidden={option['aria-hidden']}
          dangerouslySetInnerHTML={{ __html: icon.path }}
        />
      </span>
    )
  }
}

OctIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.string,
  style: PropTypes.shape({}),
}
OctIcon.defaultProps = {
  size: 'm',
  style: {},
}
