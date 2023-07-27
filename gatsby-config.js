/**
 * @type {import('gatsby').GatsbyConfig}
 */
const { languages, defaultLanguage } = require('./languages');

const siteUrl = `http://localhost:8000`;

module.exports = {
  siteMetadata: {
    siteUrl,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locale`
      }
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        localeJsonSourceName: `locale`,
      languages: [`en`, `fa`],
      defaultLanguage: `en`,
      siteUrl: `http://localhost:8000/`,
      generateDefaultLanguagePage: true,
      i18nextOptions: {
        interpolation: {
          escapeValue: false 
        },
        keySeparator: false,
        nsSeparator: false
      },
      },
    },
  ],
}
