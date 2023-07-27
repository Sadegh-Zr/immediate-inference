import { useTranslation } from 'gatsby-plugin-react-i18next';
import { graphql } from 'gatsby';
import * as React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import {
  ConditionalStatement,
  PageWrapper,
  PredicativeStatement,
  Switch,
} from '../components';
import * as styles from './index.module.css';
import {
  AFFIRMATIVE,
  CONDITIONAL,
  PREDICATIVE,
  UNIVERSAL,
} from '../constants';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';

import { useLanguage } from '../hooks';
import { dir } from 'i18next';

export default function IndexPage() {
  const { language: lng, navigate } = useI18next();
  const { t } = useTranslation(['index', 'general']);
  const { isRtl } = useLanguage();

  const [statementType, updateStatementType] = React.useState(PREDICATIVE);
  const [quantityType, updateQuantityType] = React.useState(UNIVERSAL);
  const [qualityType, updateQualityType] = React.useState(AFFIRMATIVE);
  const [firstFragment, updateFirstFragment] = React.useState('');
  const [secondFragment, updateSecondFrament] = React.useState('');
  const isErrorShown = React.useRef(false);

  const getResultsURL = () => {
    const firstFragmentParameter =
      statementType === PREDICATIVE ? 'subject' : 'antecedent';
    const secondFragmentParameter =
      statementType === PREDICATIVE ? 'predicate' : 'consequent';
    const data = {
      [firstFragmentParameter]: firstFragment,
      [secondFragmentParameter]: secondFragment,
      quantity: quantityType.toLowerCase(),
      quality: qualityType.toLowerCase(),
    }
    return `/results?${queryString.stringify(data)}`;
  };

  const handleStatementTypeChange = (newValue) => {
    updateFirstFragment('');
    updateSecondFrament('');
    updateQuantityType(UNIVERSAL);
    updateQualityType(AFFIRMATIVE);
    updateStatementType(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let text = '';
    const isPredicative = statementType === PREDICATIVE;
    if (!firstFragment && !secondFragment)
      text = t(
        isPredicative
          ? 'subjectAndPredicateMissing'
          : 'antecedentAndConsequentMissing'
      );
    else if (!firstFragment)
      text = t(isPredicative ? 'subjectMissing' : 'antecedentMissing');
    else if (!secondFragment)
      text = t(isPredicative ? 'predicateMissing' : 'consequentMissing');
    if (!text) {
      navigate(getResultsURL());
      return;
    }
    // Prevent errors queue
    if (isErrorShown.current) return;
    isErrorShown.current = true;
    toast(text, {
      type: 'error',
      onClose: () => {
        isErrorShown.current = false;
      },
    });
  };

  const statementTypeOptions = [
    {
      title: t('predicative'),
      value: PREDICATIVE,
    },
    {
      title: t('conditional'),
      value: CONDITIONAL,
    },
  ];

  return (
    <PageWrapper title={t('title')}>
      <form id="STATEMENT_FORM" onSubmit={handleSubmit} className={styles.form}>
        <ToastContainer
          rtl={isRtl}
          closeButton={false}
          transition={Slide}
          theme="colored"
          position="top-center"
          closeOnClick
          hideProgressBar
          autoClose={3000}
          className="Toast"
          limit={1}
        />
        <div className={styles.form__subContainer}>
        <div className={styles.statementSwitchContainer}>
          <Switch
            options={statementTypeOptions}
            optionPadding="0.8rem 1.2rem"
            value={statementType}
            onChange={handleStatementTypeChange}
          />
        </div>
          {statementType === PREDICATIVE ? (
            <PredicativeStatement
              subject={firstFragment}
              predicate={secondFragment}
              qualityType={qualityType}
              quantityType={quantityType}
              updateSubject={updateFirstFragment}
              updatePredicate={updateSecondFrament}
              updateQualityType={updateQualityType}
              updateQuantityType={updateQuantityType}
            />
          ) : (
            <ConditionalStatement
              antecedent={firstFragment}
              consequent={secondFragment}
              qualityType={qualityType}
              quantityType={quantityType}
              updateAntecedent={updateFirstFragment}
              updateConsequent={updateSecondFrament}
              updateQualityType={updateQualityType}
              updateQuantityType={updateQuantityType}
            />
          )}
        </div>

        <button
          form="STATEMENT_FORM"
          type="submit"
          onClick={handleSubmit}
          className={styles.form__submit}
        >
          <div className={styles.form__submitAnimator} />
          <span className={styles.form__submitText}>{t('submitButton')}</span>
        </button>
      </form>
    </PageWrapper>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(
      filter: { ns: { in: ["index", "guide", "general"] }, language: { eq: $language } }
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


export function Head({ pageContext }) {
  const { language } = pageContext;
  return (
    <>
      <html lang={language} dir={dir(language)} />
      <body className={`-${dir(language)} -${language}`} />
    </>
  )
}
