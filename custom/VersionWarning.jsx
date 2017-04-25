import React from 'react'
import { Alert } from 'react-bootstrap-externaljs'

import { translations } from 'translations'

module.exports = React.createClass({
  displayName: 'VersionWarning',
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <Alert bsStyle="danger" dangerouslySetInnerHTML={{ __html: translations.warnings[this.props.lang] }} />
    )
  },
})
