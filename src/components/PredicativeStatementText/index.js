import { useLanguage } from '../../hooks';
import { isPositiveVerb } from '../../utils';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import * as React from 'react';

const PredicativeStatementText = ({ statement }) => {
  const { lng } = useLanguage();
  const { t } = useTranslation('general');

  if (!statement) return <span>{t('notApplicable')}</span>;

  const renderWords = (words) => {
    return words.map((word, index) => {
      const previousWord = words[index - 1];
      const characterBeforeWord =
        lng === 'en' && previousWord?.text === t('complementWord') ? '' : ' ';
      const characterAfterWord =
        lng === 'en' && word.text === t('complementWord') ? '-' : '';
      return (
        <span
          key={word.id}
          className={`${
            word.text === t('complementWord')
              ?'-bold'
              : '-secondary'
          }`}
        >{`${characterBeforeWord}${word.text}${characterAfterWord}`}</span>
      );
    });
  };

  const splitedStatement = statement.split(/-| /);
  const lastWord = splitedStatement[splitedStatement.length - 1];
  const wordBeforeLastWord = splitedStatement[splitedStatement.length - 2];
  const characterBeforeLastWord =
    wordBeforeLastWord === t('complementWord') && lng === 'en' ? '' : ' ';
  const firstWord = splitedStatement[0];
  const middleWords = splitedStatement.filter(
    (item) => item !== lastWord && item !== firstWord
  );

  return (
    <div>
      <span className={lng === 'fa' ? '-bold' : '-secondary'}>
        {firstWord}
      </span>
      {renderWords(
        middleWords.map((text, index) => ({
          text,
          id: index,
        }))
      )}
      <span
        className={`${
          lng === 'fa'
            ? isPositiveVerb(lastWord.slice(0, lastWord.length - 1), {
                t,
                lng,
              })
              ? '-success'
              : '-error'
            : '-secondary'
        }`}
      >{`${characterBeforeLastWord}${lastWord}`}</span>
    </div>
  );
};

export default PredicativeStatementText;
