import webpack from 'webpack';

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport',
        content: 'width=device-width, initial-scale=1' },
      { hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico' }
    ],
    script: []
  },
  loading: { color: '#fff' },
  plugins: [
    { src: './buildmodules/plugin.js' }
  ],
  router: {
    middleware: ['checkout']
  },
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    ['@vue-storefront/nuxt'],
    ['@vue-storefront/nuxt-theme'],
    ['~/buildmodules/index.js', {
      i18n: {
        useNuxtI18nConfig: true
      }
    }]
  ],
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt'
  ],
  i18n: {
    currency: 'USD',
    country: 'US',
    countries: [
      { name: 'BE',
        label: 'Belgium' }
    ],
    currencies: [
      { name: 'EUR',
        label: 'Euro' }
    ],
    locales: [
      {
        code: 'nl',
        label: 'Nederlands (BE)',
        file: 'en.js',
        iso: 'nl'
      },
      {
        code: 'fr-BE',
        label: 'français (Belgique)',
        file: 'en.js',
        iso: 'fr'
      }
    ],
    defaultLocale: 'nl',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'nl'
    },
    detectBrowserLanguage: {
      cookieKey: 'vsf-locale'
    }
  },
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  }
};
