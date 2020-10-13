import { Configuration } from '@nuxt/types';

const port = process.env.PORT || '3000';
const host = process.env.HOST || 'localhost';
const baseUrl = process.env.BASE_URL || 'http://localhost:3000  ';
const isDev = process.env.NODE_ENV !== 'production';

const nuxtConfig: Configuration = {
  mode: 'universal',
  srcDir: 'client',
  buildDir: 'dist/client',
  rootDir: './',

  env: {
    host,
    port,
    baseUrl
  },

  dev: isDev,

  server: {
    host,
    port
  },

  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      class: 'has-navbar-fixed-top'
    },
    title: 'ERT Notes',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'ERT Notes allows you to generate ert note snippets'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'quill/dist/quill.core.css',
    'quill/dist/quill.snow.css',
    '~/assets/styles/main.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vue-imports',
    { src: '~plugins/nuxt-quill', ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/juliomrqz/nuxt-optimized-images
    '@aceforth/nuxt-optimized-images',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt/typescript
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/
    '@nuxtjs/axios',
    // Doc: https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/robots-module
    '@nuxtjs/robots',
    // Doc: https://github.com/nuxt-community/sitemap-module
    '@nuxtjs/sitemap'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: !isDev ? 'https://ert-notes.herokuapp.com/' : baseUrl,
    debug: isDev
  },

  /*
   ** @aceforth/nuxt-optimized-images module configuration
   */
  optimizedImages: {
    optimizeImages: true
  },

  router: {
    linkActiveClass: 'is-active-secondary',
    linkExactActiveClass: 'is-active'
  },

  /*
   ** Build configuration
   */
  build: {
    publicPath: '/dist',
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },
    extend(config, ctx): void {
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map';

      // Fixes npm packages that depend on `fs` module
      if (!ctx.isServer) {
        config.node = {
          fs: 'empty'
        };
      }

      if (config.module) {
        config.module.rules.push({
          test: /\.html$/i,
          loader: 'html-loader'
        });
      }
    }
  },

  pwa: {
    meta: {
      /* meta options */
      name: 'ERT Notes'
    }
  },

  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: 'https://ert-notes.herokuapp.com/sitemap.xml'
  },

  sitemap: {
    gzip: true
  },

  serverMiddleware: ['redirect-ssl']
};

export default nuxtConfig;
