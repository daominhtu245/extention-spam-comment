import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from 'vuetify/lib/locale/en'
import vi from './locales/vi-vuetify'

Vue.use(VueI18n)

const messages = {
  en: {
    ...require('@/locales/en.json'),
    $vuetify: en,
  },
  vi: {
    ...require('@/locales/vi.json'),
    $vuetify: vi,
  },
  po: {
    ...require('@/locales/po.json'),
    $vuetify: vi,
  },
  fr: {
    ...require('@/locales/fr.json'),
    $vuetify: vi,
  },
  ge: {
    ...require('@/locales/ge.json'),
    $vuetify: vi,
  },
  in: {
    ...require('@/locales/in.json'),
    $vuetify: vi,
  },
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'vi',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages,
})
