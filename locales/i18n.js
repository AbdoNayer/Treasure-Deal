import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'


const resources = {
  ar: {
    default: require('./ar/default.json'),
  },
  en: {
    default: require('./en/default.json'),
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: 'default',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: resources,
})

export default i18n