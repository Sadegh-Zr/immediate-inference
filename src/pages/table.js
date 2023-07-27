import * as React from 'react';
import { PageWrapper } from '../components';
import * as styles from './table.module.css';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { graphql } from 'gatsby';
import { dir } from 'i18next';

const Table = () => {
  const { t } = useTranslation(['table', 'general']);
  return (
    <PageWrapper
      title={t('title', { ns: 'table' })}
      className={styles.pageWrapper}
    >
      <p className={styles.description}>{t('description', { ns: 'table' })}</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>{t('universalAffirmativeShort', { ns: 'general' })}</th>
            <th>{t('particularAffirmativeShort', { ns: 'general' })}</th>
            <th>{t('universalNegativeShort', { ns: 'general' })}</th>
            <th>{t('particularNegativeShort', { ns: 'general' })}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('conversion', { ns: 'general' })}</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
            <td>{t('universalNegativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
          </tr>
          <tr>
            <td>{t('obvertedContraposition', { ns: 'general' })}</td>
            <td>{t('universalAffirmativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
            <td>{t('particularNegativeShort', { ns: 'general' })}</td>
            <td>{t('particularNegativeShort', { ns: 'general' })}</td>
          </tr>
          <tr>
            <td>{t('contraposition', { ns: 'general' })}</td>
            <td>{t('universalNegativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
          </tr>
          <tr>
            <td>{t('obvertion', { ns: 'general' })}</td>
            <td>{t('universalNegativeShort', { ns: 'general' })}</td>
            <td>{t('particularNegativeShort', { ns: 'general' })}</td>
            <td>{t('universalAffirmativeShort', { ns: 'general' })}</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
          </tr>
          <tr>
            <td>{t('subjectComplemention', { ns: 'general' })}</td>
            <td>{t('particularNegativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
          </tr>
          <tr>
            <td>{t('bothComplemention', { ns: 'general' })}</td>
            <td>{t('particularAffirmativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
            <td>{t('particularNegativeShort', { ns: 'general' })}</td>
            <td className="bold">-</td>
          </tr>
        </tbody>
      </table>
    </PageWrapper>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["table", "guide", "general"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default Table;

export function Head({ pageContext }) {
  const { language } = pageContext;
  return (
    <>
      <html lang={language} dir={dir(language)} />
      <body className={`-${dir(language)} -${language}`} />
    </>
  )
}