import * as React from 'react';
import { ThemeContext } from '../contexts';
import { dir } from 'i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import {
  AFFIRMATIVE,
  UNIVERSAL,
  BOTH_COMPLEMENTION,
  CONTRAPOSITION,
  CONVERSION,
  FIRST_FRAGMENT_COMPLEMENTION,
  OBVERTED_CONTRAPOSITION,
  OBVERTION,
  TRUE_IMMEDIATE_STATEMENTS,
  PARTICULAR,
  NEGATIVE,
} from '../constants';
import { appendComma, appendSuffix, getStatementType } from '../utils';
import { useDebounce } from 'use-debounce';

export const useLanguage = () => {
  const { language } = useI18next();
  const direction = dir(language);
  return { lng: language, direction, isRtl: direction === 'rtl' };
};

export const useTheme = () => {
  const result = React.useContext(ThemeContext);
  return result;
};

export const useStatementFunctions = ({ t, lng }) => {
  const getQualityText = ({ value, quantity }) => {
    if (!value) return '';
    if (lng === 'fa') {
      if (quantity === UNIVERSAL)
        return t(
          value === AFFIRMATIVE
            ? 'positiveSingularVerb'
            : 'negativeSingularVerb',
          { ns: 'general' }
        );
      return t(
        value === AFFIRMATIVE ? 'positivePluralVerb' : 'negativePluralVerb',
        { ns: 'general' }
      );
    } else if (lng === 'en') {
      if (value === AFFIRMATIVE) return t('positiveVerb', { ns: 'general' });
      return t(quantity === UNIVERSAL ? 'positiveVerb' : 'negativeVerb', {
        ns: 'general',
      });
    }
  };
  const getQuantityText = ({ value, quality }) => {
    if (!value) return '';
    if (value === UNIVERSAL) {
      return t(
        quality === AFFIRMATIVE
          ? 'universalPositiveIndicator'
          : 'universalNegativeIndicator',
        { ns: 'general' }
      );
    }
    return t('particularIndicator', { ns: 'general' });
  };

  const getConditionalQuantityText = ({ value, quality }) => {
    if (!value) return '';
    if (value === PARTICULAR)
      return t('particularConditionalQuantity', { ns: 'general' });
    return t(
      quality === AFFIRMATIVE
        ? 'universalPositiveConditionalQuantity'
        : 'universalNegativeConditionalQuantity',
      { ns: 'general' }
    );
  };

  const getConditionalQualityText = ({ value, quantity }) => {
    if (!value) return '';
    if (lng === 'fa')
      return t(
        value === AFFIRMATIVE
          ? 'positiveConditionalQuality'
          : 'negativeConditionalQuality',
        { ns: 'general' }
      );
    else if (lng === 'en') {
      if (quantity === PARTICULAR && value === NEGATIVE)
        return t('negativeConditionalQuality', { ns: 'general' });
      return t('positiveConditionalQuality', { ns: 'general' });
    }
  };

  const complement = (text, isPredicative) => {
    if (!isPredicative) return `!(${text})`;
    const complementWord = t('complementWord', { ns: 'general' });
    const characterBetweenComplementAndWord = lng === 'fa' ? ' ' : '-';
    const result = text.startsWith(
      `${complementWord}${characterBetweenComplementAndWord}`
    )
      ? text.slice(complementWord.length)
      : `${complementWord}${characterBetweenComplementAndWord}${text}`;
    return result;
  };

  const generateStatement = ({
    quantity,
    firstFragment,
    secondFragment,
    quality,
    isPredicative,
  }) => {
    const quantityText = (
      isPredicative ? getQuantityText : getConditionalQuantityText
    )({ value: quantity, quality });
    const qualityText = (
      isPredicative ? getQualityText : getConditionalQualityText
    )({ value: quality, quantity });
    if (isPredicative) {
      const farsiStatement = `${quantityText} ${appendSuffix(firstFragment, {
        lng,
        quantity,
      })} ${secondFragment} ${qualityText}.`;
      const englishStatement = `${quantityText} ${appendSuffix(firstFragment, {
        lng,
        quantity,
      })} ${qualityText} ${secondFragment}.`;
      return lng === 'fa' ? farsiStatement : englishStatement;
    }
    const statement = `${quantityText} ${qualityText} ${t('thatIf', {
      ns: 'general',
    })} ${appendComma(firstFragment, lng)} ${t('then', {
      ns: 'general',
    })} ${secondFragment}.`;
    return statement;
  };

  const getConversed = (statement, isPredicative) => {
    const statementType = getStatementType(statement);
    const newStatement = TRUE_IMMEDIATE_STATEMENTS.find(
      ({ type }) => type === statementType
    ).conversed;
    if (!newStatement) return null;
    const { quality, quantity } = newStatement;
    return generateStatement({
      firstFragment: statement.secondFragment,
      secondFragment: statement.firstFragment,
      isPredicative: statement.isPredicative,
      quality,
      quantity,
    });
  };

  const getContraposited = (statement) => {
    const statementType = getStatementType(statement);
    const newStatement = TRUE_IMMEDIATE_STATEMENTS.find(
      ({ type }) => type === statementType
    ).contraposited;
    if (!newStatement) return null;
    const { quality, quantity } = newStatement;
    return generateStatement({
      firstFragment: complement(
        statement.secondFragment,
        statement.isPredicative
      ),
      secondFragment: statement.firstFragment,
      isPredicative: statement.isPredicative,
      quality,
      quantity,
    });
  };

  const getObvertedContraposition = (statement) => {
    const statementType = getStatementType(statement);
    const newStatement = TRUE_IMMEDIATE_STATEMENTS.find(
      ({ type }) => type === statementType
    ).obvertedContaposition;
    if (!newStatement) return null;
    const { quality, quantity } = newStatement;
    return generateStatement({
      firstFragment: complement(
        statement.secondFragment,
        statement.isPredicative
      ),
      secondFragment: complement(
        statement.firstFragment,
        statement.isPredicative
      ),
      isPredicative: statement.isPredicative,
      quality,
      quantity,
    });
  };

  const getObverted = (statement) => {
    const statementType = getStatementType(statement);
    const newStatement = TRUE_IMMEDIATE_STATEMENTS.find(
      ({ type }) => type === statementType
    ).obverted;
    if (!newStatement) return null;
    const { quality, quantity } = newStatement;
    return generateStatement({
      firstFragment: statement.firstFragment,
      secondFragment: complement(
        statement.secondFragment,
        statement.isPredicative
      ),
      isPredicative: statement.isPredicative,
      quality,
      quantity,
    });
  };

  const getComplementedFirstFragment = (statement) => {
    const statementType = getStatementType(statement);
    const newStatement = TRUE_IMMEDIATE_STATEMENTS.find(
      ({ type }) => type === statementType
    ).complementedFirstFragment;
    if (!newStatement) return null;
    const { quality, quantity } = newStatement;
    return generateStatement({
      firstFragment: complement(
        statement.firstFragment,
        statement.isPredicative
      ),
      secondFragment: statement.secondFragment,
      isPredicative: statement.isPredicative,
      quality,
      quantity,
    });
  };

  const getComplementedBoth = (statement) => {
    const statementType = getStatementType(statement);
    const newStatement = TRUE_IMMEDIATE_STATEMENTS.find(
      ({ type }) => type === statementType
    ).complementedBoth;
    if (!newStatement) return null;
    const { quality, quantity } = newStatement;
    return generateStatement({
      firstFragment: complement(
        statement.firstFragment,
        statement.isPredicative
      ),
      secondFragment: complement(
        statement.secondFragment,
        statement.isPredicative
      ),
      isPredicative: statement.isPredicative,
      quality,
      quantity,
    });
  };

  const generateImmediateStatements = (originalStatement) => {
    return [
      {
        type: CONVERSION,
        statement: getConversed(originalStatement),
      },
      {
        type: CONTRAPOSITION,
        statement: getContraposited(originalStatement),
      },
      {
        type: OBVERTED_CONTRAPOSITION,
        statement: getObvertedContraposition(originalStatement),
      },
      {
        type: OBVERTION,
        statement: getObverted(originalStatement),
      },
      {
        type: FIRST_FRAGMENT_COMPLEMENTION,
        statement: getComplementedFirstFragment(originalStatement),
      },
      {
        type: BOTH_COMPLEMENTION,
        statement: getComplementedBoth(originalStatement),
      },
    ];
  };

  return {
    getQualityText,
    getQuantityText,
    getConditionalQuantityText,
    complement,
    generateStatement,
    generateImmediateStatements,
    getConditionalQualityText,
  };
};

export const useDebounceRef = (...params) => {
  const [debouncedValue] = useDebounce(...params);
  const refValue = React.useRef(debouncedValue);
  React.useEffect(() => {
    refValue.current = debouncedValue;
  }, [debouncedValue]);

  const getLatestValue = () => refValue.current;
  return [debouncedValue, getLatestValue];
};

