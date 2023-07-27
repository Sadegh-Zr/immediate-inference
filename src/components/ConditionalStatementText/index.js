import * as React from 'react';
import { useLanguage } from '../../hooks';
import { appendComma } from '../../utils';

const ConditionalStatementText = ({ statement }) => {
  const { lng } = useLanguage();
  const words = statement.split(' ');
  const renderWords = () =>
    words.map((word, index) => {
      const characterBefore = !index ? '' : ' ';
      if (
        word.startsWith('!(') &&
        (word.endsWith(appendComma(')', lng)) || word.endsWith(').'))
      ) {
        const negativeMarkStart = word.slice(0, 2);
        const negativeMarkEnd = word.slice(word.length - 2, word.length - 1);
        const wordWithoutMark = word.slice(2, word.length - 2);
        const endingMark = word.slice(word.length - 1);
        return (
          <span key={index}>
            <span
              className="-bold -error"
            >{` ${negativeMarkStart}`}</span>
            <span className="-secondary">{wordWithoutMark}</span>
            <span className="-bold -error">
              {negativeMarkEnd}
            </span>
            <span className={"-secondary"}>{endingMark}</span>
          </span>
        );
      } else if (word.startsWith('!(')) {
        const negativeMarkStart = word.slice(0, 2);
        const wordWithoutNegativeMark = word.slice(2);
        return (
          <span key={index}>
            <span
              className="-bold -error"
            >{` ${negativeMarkStart}`}</span>
            <span className="-secondary">
              {wordWithoutNegativeMark}
            </span>
          </span>
        );
      } else if (word.endsWith(appendComma(')', lng)) || word.endsWith(').')) {
        const endingMark = word.slice(word.length - 2, word.length - 1);
        const wordWithoutEndingMark = word.slice(0, word.length - 2);
        return (
          <span key={index}>
            <span
              className="-secondary"
            >{` ${wordWithoutEndingMark}`}</span>
            <span className="-bold -error">
              {endingMark}
            </span>
            <span className="-secondary">
              {word.slice(word.length - 1)}
            </span>
          </span>
        );
      }
      const colorClassName = lng === 'fa' && index === 2 ? '-bold' : '';
      return (
        <span
          className={`${
            lng === 'fa' && index === 2
              ? ''
              : !index ? '-bold' : '-secondary'
          } ${colorClassName}`}
          key={index}
        >{`${characterBefore}${word}`}</span>
      );
    });
  return <div>{renderWords()}</div>;
};

export default ConditionalStatementText;
