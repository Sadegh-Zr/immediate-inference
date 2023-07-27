// import Link from 'next/link';
import * as React from 'react';
import * as styles from './LanguageSwitch.module.css';
import { Link, useI18next } from 'gatsby-plugin-react-i18next';
import { getLngTitle } from '../../utils';

const LanguageSwitch = () => {
  const { originalPath, languages, language: activeLanguage } = useI18next();
  const renderOptions = () =>
    languages.map(lng => {
      return (
        <Link
          replace
          key={lng}
          to={originalPath}
          language={lng}
          className={`${styles.LanguageSwitch__option} ${
            lng === activeLanguage ? styles.selected : ''
          }`}
        >
          <span className={styles.LanguageSwitch__optionTitle}>
            {getLngTitle(lng).toUpperCase()}
          </span>
        </Link>
      );
    });
  return <div className={styles.LanguageSwitch}>{renderOptions()}</div>;
};

export default LanguageSwitch;
