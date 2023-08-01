import * as React from 'react';
import * as styles from './Header.module.css';
import { BsMoon, BsSun } from 'react-icons/bs';
import { RiQuestionMark } from 'react-icons/ri';
import { FiGithub } from 'react-icons/fi';
import { RxTable } from 'react-icons/rx';
import LanguageSwitch from '../LanguageSwitch';
import { useLanguage, useTheme } from '../../hooks';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';

const Header = ({ title, hideLngChange, onGuideClick }) => {
  const { t } = useTranslation('general');
  const { theme, setTheme } = useTheme();
  const changeTheme = ({ currentTarget }) => {
    currentTarget.disabled = true;
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <header className={styles.Header}>
      <nav
        className={`${styles.nav} ${
          hideLngChange ? styles.equalHorizontalPadding : ''
        }`}
      >
        <div className={styles.nav__innerContainer}>
          <button
            type="button"
            onClick={changeTheme}
            id="themeChangeButton"
            aria-label={t(`themeSwitch${theme === 'light' ? 'Dark' : 'Light'}`, { ns: 'general'})}
            className={styles.nav__button}
          >
            {theme === 'light' ? (
              <BsSun size="2.3rem" fill="#000" />
            ) : (
              <BsMoon
                style={{ rotate: '-104deg' }}
                size="2.1rem"
                color="#fff"
              />
            )}
          </button>
          <Link to="/table" aria-label={t('table', { ns: 'general'})} className={styles.nav__button}>
            <RxTable size="2.2rem" color="var(--color-text-primary)" />
          </Link>
          {!hideLngChange && (
            <>
              <button
                type="button"
                onClick={onGuideClick}
                className={styles.nav__button}
                aria-label={t('guide', { ns: 'general' })}
              >
                <RiQuestionMark
                  style={{ transform: 'scaleX(-1)' }}
                  size="2.1rem"
                  color="var(--color-text-primary)"
                />
              </button>
              <a
                target="_blank"
                href="https://github.com/Sadegh-Zr/immediate-inference"
                rel="noreferrer"
                aria-label={t('github', { ns: 'general'})}
                className={styles.nav__button}
              >
                <FiGithub size="2rem" color="var(--color-text-primary)" />
              </a>
            </>
          )}
        </div>
        <div className={styles.nav__innerContainer}>
          {hideLngChange ? (
            <>
              <button
                type="button"
                onClick={onGuideClick}
                className={styles.nav__button}
              >
                <RiQuestionMark
                  size="2.1rem"
                  color="var(--color-text-primary)"
                />
              </button>
              <a
                target="_blank"
                href="https://github.com/Sadegh-Zr/immediate-inference"
                rel="noreferrer"
                className={styles.nav__button}
                aria-label={t('github', { ns: 'general'})}
              >
                <FiGithub size="2rem" color="var(--color-text-primary)" />
              </a>
            </>
          ) : (
            <LanguageSwitch />
          )}
        </div>
      </nav>
      <h1 className={styles.Header__title}>{title}</h1>
    </header>
  );
};

export default Header;
