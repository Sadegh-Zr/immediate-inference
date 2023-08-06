/**
 * @type {import('gatsby').GatsbyConfig}
 */

const siteUrl = `https://sadegh-zr.github.io/immediate-inference`;

module.exports = {
  pathPrefix: "/immediate-inference",
  siteMetadata: {
    siteUrl,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `#3498db`,
        showSpinner: false,
      },
    },
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
      siteUrl,
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Immediate Inference`,
        short_name: `Immediate Inf.`,
        start_url: `/`,
        description: "Get all true statements from your inputed statement using immediate inference in logic",
        background_color: `#fff`,
        lang: 'en',
        theme_color: `#3498db`,
        display: `standalone`,
        icon: "./src/images/icon.svg",
        icon_options: {
          purpose: `any maskable`,
        },
        localize: [
          {
            start_url: `/fa/`,
            lang: `fa`,
            name: `قضایای مباشر`,
            short_name: `قضایای مباشر`,
            description: `تمام قضایای صحیح را به وسیله استدلال مباشر منطقی از قضیه مد نظر خود بدست آورید`,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-offline',
   },
  ],
}
