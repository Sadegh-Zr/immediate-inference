import * as React from 'react';
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import {
  ConditionalStatementText,
  PageWrapper,
  PredicativeStatementText,
} from '../components';
import {
  BOTH_COMPLEMENTION,
  CONTRAPOSITION,
  CONVERSION,
  FIRST_FRAGMENT_COMPLEMENTION,
  OBVERTED_CONTRAPOSITION,
  OBVERTION,
} from '../constants';
import { useStatementFunctions } from '../hooks';
import * as styles from './results.module.css';
import { graphql } from 'gatsby';
import { dir } from 'i18next';
import { isBrowser } from '../utils';

const Results = () => {
  const { language: lng } = useI18next();
  const searchParams = new URLSearchParams(isBrowser ? window.location.search : '');
  const isPredicative = searchParams.get('subject');
  const originalStatement = {
    quality: (searchParams.get('quality'))?.toUpperCase(),
    quantity: searchParams.get('quantity')?.toUpperCase(),
    firstFragment: searchParams.get(isPredicative ? 'subject' : 'antecedent'),
    secondFragment: searchParams.get(
      isPredicative ? 'predicate' : 'consequent'
    ),
    isPredicative,
  };
  const { t } = useTranslation(['results', 'general']);
  const { generateImmediateStatements, generateStatement } =
    useStatementFunctions({ t, lng });
  if (!isBrowser) return <div />
  const IMMEDIATE_STATEMENTS_TYPES = [
    {
      type: CONVERSION,
      title: t('conversion', { ns: 'general' }),
    },
    {
      type: OBVERTED_CONTRAPOSITION,
      title: t('obvertedContraposition', { ns: 'general' }),
    },
    {
      type: CONTRAPOSITION,
      title: t('contraposition', { ns: 'general' }),
    },
    {
      type: OBVERTION,
      title: t(
        lng === 'fa' && !isPredicative ? 'conditionalObvertion' : 'obvertion',
        { ns: 'general' }
      ),
    },
    {
      type: FIRST_FRAGMENT_COMPLEMENTION,
      title: t(
        isPredicative ? 'subjectComplemention' : 'AntecedentComplemention',
        { ns: 'general' }
      ),
    },
    {
      type: BOTH_COMPLEMENTION,
      title: t('bothComplemention', { ns: 'general' }),
    },
  ];
  const TextComponent = isPredicative
    ? PredicativeStatementText
    : ConditionalStatementText;
  const renderItems = () =>
    IMMEDIATE_STATEMENTS_TYPES.map(({ type, title }, index) => {
      const { statement } = generateImmediateStatements(originalStatement).find(
        (resultStatment) => type === resultStatment.type
      );
      const animationDelay = `${index * 150 + 200}ms`;
      return (
        <div
          key={type}
          className={`${styles.resultItem} Results_resultItem`}
          style={{ animationDelay }}
        >
          <h3>{title}:</h3>
          <div>
            <TextComponent statement={statement} />
          </div>
        </div>
      );
    });
  return (
    <PageWrapper
      lng={lng}
      hideLngChange
      className={styles.pageWrapper}
      title={t('title')}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.originalStatement}>
          <h2>{t('original')}: </h2>
          <span>{generateStatement(originalStatement)}</span>
        </div>
        {!isPredicative && (<p className={styles.guide}>{t('guide')}</p>)}
        <div className={styles.resultContainer}>{renderItems()}</div>
      </div>
    </PageWrapper>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["results", "guide", "general"] }, language: { eq: $language } }
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


export default Results;

export function Head({ pageContext, data }) {
  const { language } = pageContext;
  const pageLocale = data.locales.edges.find(edge => {
    return edge.node.ns === 'results';
  });
  const generalLocale = data.locales.edges.find(edge => {
    return edge.node.ns === 'general';
  });
  const localeData = JSON.parse(pageLocale.node.data);
  const generalLocaleData = JSON.parse(generalLocale.node.data)
  return (
    <>
      <html lang={language} dir={dir(language)} />
      <title>{localeData.title}</title>
      <meta name="description" content={generalLocaleData?.description} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : 'fa_IR'} />
      <meta property="og:title" content={localeData?.title} />
      <meta name="og:description" content={generalLocaleData?.description} />
      <meta property="og:image" content={"https://github.com/Sadegh-Zr/immediate-inference/assets/93543701/3beac570-39eb-4671-b130-ede8d1af593c"} />
      <body className={`-${dir(language)} -${language}`} />
    </>
  )
}