import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { prefixLink } from 'gatsby-helpers'
import { NavDropdown, MenuItem } from 'react-bootstrap-externaljs'
import { LinkContainer } from 'react-router-bootstrap'
import pageInfo from 'utils/pageInfo'
import { languages } from 'i18n'

import 'css/language-menu.sass'
import 'css/flags.sass'

const FlagIcon = item => (
  <span className={`flag-icon ${item.code}`} />
)

export default class LanguageMenu extends Component {
  render () {
    const { language, translations } = pageInfo(this.props.location.pathname)
    return (
      <NavDropdown
        title={<FlagIcon code={language} size="lg" />}
        id="language-menu"
        className="language-menu"
        data-toggle="dropdown"
      >

        {Object.keys(languages).map((lang, index) => (
          translations[lang] ?
            <LinkContainer key={lang} to={prefixLink(translations[lang].path)}>
              <MenuItem eventKey={index}>
                <FlagIcon code={lang} size="lg" />
              </MenuItem>
            </LinkContainer>
          :
            <MenuItem key={lang} eventKey={index} disabled>
              <FlagIcon code={lang} size="lg" />
            </MenuItem>
        ))}

      </NavDropdown>
    )
  }
}

LanguageMenu.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
}
