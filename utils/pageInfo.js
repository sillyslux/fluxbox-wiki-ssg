/* eslint-disable no-confusing-arrow */
import { pages } from 'config'
import { prefixLink } from 'gatsby-helpers'
import { languages } from 'i18n'

const getLang = page => Object.keys(languages)
  .includes(page.file.name) ? page.file.name : 'en'

const getTranslations = (page) => {
  const translations = {}
  pages.filter(p => p.path).filter(p => p.file.dir === page.file.dir)
    .forEach((a) => {
      if (
        a.file.name!==page.file.name &&
        Object.keys(languages).includes(page.file.name) &&
        Object.keys(languages).includes(a.file.name)
      ) {
        translations[a.file.name] = a
      }
    })
  return translations
}

export default function (location) {
  const page = pages.filter(p => p.path).find(p => [p.path, prefixLink(p.path)].includes(location))||{ file: '', requirePath: '' }

  return {
    page,
    language: getLang(page),
    translations: getTranslations(page),
  }
}
