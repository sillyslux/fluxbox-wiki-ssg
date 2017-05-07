/* global window */
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { languages } from 'i18n'

exports.data = {
  title: 'Fluxbox Wiki',
  path: '/',
}

export default class Index extends Component {
  componentDidMount () {
    const browserLang = window.navigator.language.slice(0, 2)
    const lang = window.localStorage.getItem('lang') || languages.includes(browserLang) ? browserLang : 'en'
    browserHistory.push(prefixLink(`${lang}/`))
  }
  render () {
    return (
      <div>
          no javascript message here...
          testyay+
          gage
      </div>
    )
  }
}
