import React from 'react'
import { Navbar } from 'react-bootstrap-externaljs'

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.any,
    }
  },
  render () {
    return (
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              fluxbox<span className="navbar-logo" />wiki
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
      </div>
    )
  },
})
