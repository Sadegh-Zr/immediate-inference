import { useTranslation } from 'gatsby-plugin-react-i18next';
import {
  AFFIRMATIVE,
  NEGATIVE,
  PARTICULAR,
  PREDICATIVE,
  UNIVERSAL,
} from '../../constants';
import Switch from '../Switch';
import * as styles from './StatementForm.module.css';
import { useLanguage } from '../../hooks';
import * as React from 'react'

const StatementForm = ({
  firstFragment,
  secondFragment,
  quantityType,
  updateQuantityType,
  qualityType,
  updateFirstFragment,
  updateSecondFrament,
  updateQualityType,
  onFirstFragmentFocus,
  onFirstFragmentBlur,
  type,
}) => {
  const isPredicative = type === PREDICATIVE;
  const { isRtl } = useLanguage();
  const { t } = useTranslation('general');
  const handleFirstFragmentInputChange = ({ target }) => {
    updateFirstFragment(target.value);
  };
  const handleSecondFragmentInputChange = ({ target }) => {
    updateSecondFrament(target.value);
  };
  const qualityTypeList = [
    {
      title: t(!isPredicative || !isRtl ? 'positive' : 'positiveSingularVerb'),
      value: AFFIRMATIVE,
    },
    {
      title: t(!isPredicative || !isRtl ? 'negative' : 'negativeSingularVerb'),
      value: NEGATIVE,
    },
  ];

  const quantityTypeList = [
    {
      title: t(!isPredicative || !isRtl ? 'particular' : 'particularIndicator'),
      value: PARTICULAR,
    },
    {
      title: t(
        !isPredicative || !isRtl ? 'universal' : 'universalPositiveIndicator'
      ),
      value: UNIVERSAL,
    },
  ];

  return (
    <div
      className={`${styles.StatementForm} ${
        styles[isPredicative ? 'predicative' : 'conditional']
      }`}
    >
      <div className={styles.inputContainer}>
        <div className={styles.subjectForm}>
          {isRtl && isPredicative && (
            <Switch
              value={quantityType}
              onChange={updateQuantityType}
              options={quantityTypeList}
              optionPadding="0.5rem 0.7rem"
              fontSize="var(--font-size-primary)"
              radiusRight
              isVertical
            />
          )}
          <input
            onBlur={onFirstFragmentBlur}
            onFocus={onFirstFragmentFocus}
            type="text"
            className={styles.subjectForm__input}
            value={firstFragment}
            onChange={handleFirstFragmentInputChange}
            placeholder={t(isPredicative ? 'subject' : 'antecedent')}
          />
        </div>
        <div className={styles.predicateForm}>
          <input
            type="text"
            className={styles.predicateForm__input}
            value={secondFragment}
            onChange={handleSecondFragmentInputChange}
            placeholder={t(isPredicative ? 'predicate' : 'consequent')}
          />
          {isRtl && isPredicative && (
            <Switch
              colorful
              value={qualityType}
              onChange={updateQualityType}
              options={qualityTypeList}
              optionPadding="0.5rem 0.7rem"
              fontSize="var(--font-size-primary)"
              isVertical
            />
          )}
        </div>
      </div>
      {(!isRtl || !isPredicative) && (
        <div className={styles.switchesContainer}>
          <Switch
            value={quantityType}
            onChange={updateQuantityType}
            options={quantityTypeList.reverse()}
            optionPadding="1.2rem 0.7rem"
            fontSize="var(--font-size-small)"
          />
          <Switch
            colorful
            value={qualityType}
            onChange={updateQualityType}
            options={qualityTypeList}
            optionPadding="1.2rem 0.7rem"
            fontSize="var(--font-size-small)"
          />
        </div>
      )}
    </div>
  );
};

export default StatementForm;
