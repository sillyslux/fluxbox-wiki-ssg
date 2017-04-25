import React from 'react'
import { prefixLink } from 'gatsby-helpers'
import { Grid, Nav, NavItem } from 'react-bootstrap-externaljs'
import { LinkContainer } from 'react-router-bootstrap'
import { pages } from 'config'

import 'css/subnav-history.sass'

const NavItemRouted = item => (
  <LinkContainer to={item.link}>
    <NavItem eventKey={item.link}>{item.text}</NavItem>
  </LinkContainer>
)

module.exports = React.createClass({
  displayName: 'BCHistory',
  propTypes () {
    return {
      children: React.PropTypes.any,
      location: React.PropTypes.Object(),
    }
  },
  getInitialState (initial) {
    return {
      visible: false,
      history: [],
    }
  },
  hide () {
    this.setState({ visible: false })
  },
  // setState (prevState, props) {
  //   console.log(prevState, props)
  //   return prevState
  // },
  componentWillReceiveProps (newProps) {
    // debugger
    console.log('history add from SubNavHistory', newProps)
    const history = this.state.history
    let index = history.findIndex(loc=>loc===newProps.location.pathname)
    console.log(index)
    if(~index) {
      history.unshift(history.splice(index,1).find(e=>e))
    } else {
      history.unshift(newProps.location.pathname)
      history.length=history.length>5?5:history.length
    }
    this.setState({ history })
  },
  render () {
    const page = pages.filter(p => p.path).find(p => [p.path, prefixLink(p.path)].includes(this.props.location.pathname))||{ file: '', requirePath: '' }
    return (
      <div className={`subnav-history animated-subnavi slideDown ${this.state.visible?'':'slideUp'}`} onMouseLeave={this.hide}>
        <Grid>
          <Nav>
            {this.state.history.map((h, i) => {
              const hPage = pages.filter(p => p.path)
                .find(p => [p.path, prefixLink(p.path)].includes(h))
              return hPage ?
                (<NavItemRouted key={`${i}${hPage.path}`} text={hPage.data.title} link={prefixLink(hPage.path)} />)
              :
              null
            },
            )}
          </Nav>
        </Grid>
      </div>
    )
  },
})
