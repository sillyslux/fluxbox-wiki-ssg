import React from 'react'
import { Grid, MenuItem, Button, ButtonToolbar, SplitButton, DropdownButton } from 'react-bootstrap-externaljs'
import { pages } from 'config'
import { prefixLink } from 'gatsby-helpers'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import 'css/subnav-pagetree.sass'

let location
const MenuItemRouted = item => (
  <LinkContainer to={item.link}>
    <MenuItem eventKey={item.link}>{item.text}</MenuItem>
  </LinkContainer>
)

module.exports = React.createClass({
  displayName: 'BCPageTree',
  propTypes () {
    return {
      children: React.PropTypes.any,
      location: React.PropTypes.String(),
    }
  },
  getInitialState () {
    return {
      visible: false,
    }
  },
  hide () {
    this.setState({ visible: false })
  },
  render () {
    location = this.props.location || ''
    const [lang, wiki, ...path] = location === prefixLink(location) ?
      location.split('/').filter(a => a)
    :
      location.split('/').filter(a => a).filter((a, b) => b)

    if (!lang || !wiki || !path.length) return null

    let assembledPath = prefixLink(`/${lang}/${wiki}`)
    const page = pages.filter(p => p.path).find(p => [p.path, prefixLink(p.path)].includes(location))||{ file: '', requirePath: '' }
    if (!page.requirePath) return null

    const pageTree = {}
    const breadcrumbs = []

    pages.filter(p => p.requirePath.replace(/\/.+/, '') === page.requirePath.replace(/\/.+/, '') && p.file.name === page.file.name)
      .forEach(p =>
        p.path.replace(/^\/[^/]+\/[^/]+\//, '').split('/').filter(p => p)
          .reduce((p, c) => p[c]=p[c]||{}, pageTree)
      )
    breadcrumbs.push(pageTree)
    path.reduce((a, b) => { breadcrumbs.push(a[b]||{}); return a[b]||{} }, pageTree)

    // debugger

    return (
      <ButtonToolbar className={`subnav-pagetree bc-pagetree animated-subnavi slideDown ${this.state.visible?'':'slideUp'}`} onMouseLeave={this.hide}>
        <Grid>
          {breadcrumbs.map((bc, i) => {
            const menu = Object.keys(bc).length > 1 ? (
              path[i] ? (
                <SplitButton bsStyle="link" title={path[i]} key={i} id={i} className="bcDropdown" href={`${assembledPath}/${path[i]}/`} data-toggle="dropdown">
                  {Object.keys(bc).map(sub => <MenuItemRouted link={`${assembledPath}/${sub}/`} text={sub} key={sub}>{sub}</MenuItemRouted>)}
                </SplitButton>
              ) : (
                <DropdownButton bsStyle="link" title={'subpages'} key={i} id={i} className="bcDropdown" data-toggle="dropdown" >
                  {Object.keys(bc).map(sub => <MenuItem key={sub} href={`${assembledPath}/${sub}/`}>{sub}</MenuItem>)}
                </DropdownButton>
              )
            ) : (
              <Button bsStyle="link" key={i} id={i}>
                <Link to={`${assembledPath}/${path[i]}/`}>
                  {path[i]}
                </Link>
              </Button>
            )
            assembledPath += `/${path[i]}`
            return menu
          })}
        </Grid>
      </ButtonToolbar>
    )
    // <div dangerouslySetInnerHTML={{ __html: `${JSON.stringify({emptyString:prefixLink(''),location,location_prefixed:prefixLink(location),lang,wiki,path,assembledPath,pageTree,breadcrumbs}, null, 2)}` }} />
  },
})
