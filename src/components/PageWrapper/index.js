import Header from '../Header';
import Rodal from 'rodal';
import * as React from 'react';
import * as styles from './PageWrapper.module.css';
import { EITAA_MESSANGER, EMAIL } from '../../constants';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import 'rodal/lib/rodal.css';
import { isBrowser } from '../../utils';

const PageWrapper = ({ className, title, children, hideLngChange }) => {
  const { t } = useTranslation('guide');
  const isGuideVisibleFromStorage = !JSON.parse(isBrowser ? localStorage.getItem('hasGuideShown') : false);
  const [isGuideModalVisible, updateModalVisibility] = React.useState(false);
  const installPrompt = React.useRef();
  const toggleModal = () => {
    if (isGuideModalVisible) {
      if (!JSON.parse(localStorage.getItem('hasGuideShown'))) {
        if(installPrompt.current?.prompt) installPrompt.current.prompt();
      }
      updateModalVisibility(false);
      localStorage.setItem('hasGuideShown', true);
    } else updateModalVisibility(true);
  };

  React.useEffect(() => {
    const handleBeforeInstall = (event) => {
      if(!event.prompt) return;
      event.preventDefault();
      installPrompt.current = event;
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall, true);
    }
  }, []);

  React.useEffect(() => {
    const submitButton = document.getElementById('IndexSubmitButton');
    const handleAnimationEnd = (e) => {
      if(!e.elapsedTime) return;
      if (isGuideVisibleFromStorage) {
        updateModalVisibility(true);
      }
    }
    submitButton.addEventListener('animationend', handleAnimationEnd);

    return () => {
      submitButton.removeEventListener('animationend', handleAnimationEnd, false)
    }
  }, []);
  return (
    <div className={`${styles['PageWrapper']} ${isGuideVisibleFromStorage ? '-guideShown' : ''  } ${className}`}>
      <Header
        hideLngChange={hideLngChange}
        title={title}
        onGuideClick={toggleModal}
      />
      {children}
      <Rodal
        visible={isGuideModalVisible}
        className={styles.modal}
        onClose={toggleModal}
        leaveAnimation="fade"
      >
        <div className={styles.modal__contentContainer}>
          <h1>{t('modalTitle')} 👋</h1>
          <p>{t('modalFirstParagraph')} </p>
          <p>
            {t('modalSecondParagraph')}{' '}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://maktabevahy.org/Document/Speech/Details/14/%D8%AE%D9%88%D8%AF-%D8%B1%D8%A7-%D8%A8%D8%B4%D9%86%D8%A7%D8%B3-%D8%AA%D8%A7-%D8%AE%D8%AF%D8%A7-%D8%B1%D8%A7-%D8%A8%D8%B4%D9%86%D8%A7%D8%B3%DB%8C?page=5http"
            >
              {t('modalSecondParagraphLinkText')}
            </a>
          </p>
          <p>
            {t('modalThirdParagraphContactBefore')}{' '}
            <a href={`mailto: ${EMAIL}`}>{t('email')}</a> {t('and')}{' '}
            <a href={EITAA_MESSANGER} target="_blank"  rel="noreferrer">
              {t('eitaaMessanger')}
            </a>{' '}
            {t('modalThirdParagraphContactAfter')}
          </p>
          <p>{t('modalForthParagraph')}</p>
          <div className={styles.modalButtonContainer}>
            <button form="_" onClick={toggleModal}>
              {t('modalButton')}
            </button>
          </div>
        </div>
      </Rodal>
    </div>
  );
};

export default PageWrapper;
