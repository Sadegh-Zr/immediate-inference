import pluralize from 'pluralize';
import {
  AFFIRMATIVE,
  UNIVERSAL,
  PARTICULAR_AFFIRMATIVE,
  PARTICULAR_NEGATIVE,
  UNIVERSAL_AFFIRMATIVE,
  UNIVERSAL_NEGATIVE,
  TYPED_AND_REMOVED,
  JUST_TYPED,
  JUST_REMOVED,
} from '../constants';

const getBorderRadius = (element) => {
  const borderTopLeft = getComputedStyle(element).getPropertyValue(
    'border-top-left-radius'
  );
  const borderTopRight = getComputedStyle(element).getPropertyValue(
    'border-top-right-radius'
  );
  const borderBottomRight = getComputedStyle(element).getPropertyValue(
    'border-bottom-right-radius'
  );
  const borderBottomLeft = getComputedStyle(element).getPropertyValue(
    'border-bottom-left-radius'
  );
  return `${borderTopLeft} ${borderTopRight} ${borderBottomRight} ${borderBottomLeft}`;
};

const findFirstDifferentPosition = (a, b) => {
  const shorterLength = Math.min(a.length, b.length);
  for (let i = 0; i < shorterLength; i++) {
    if (a[i] !== b[i]) return i;
  }
  if (a.length !== b.length) return shorterLength;
  return -1;
};

const getStatementType = ({ quality, quantity }) => {
  if (quantity === UNIVERSAL && quality === AFFIRMATIVE)
    return UNIVERSAL_AFFIRMATIVE;
  else if (quantity !== UNIVERSAL && quality === AFFIRMATIVE)
    return PARTICULAR_AFFIRMATIVE;
  else if (quantity === UNIVERSAL && quality !== AFFIRMATIVE)
    return UNIVERSAL_NEGATIVE;
  return PARTICULAR_NEGATIVE;
};

const appendPersianRelationLetter = (word) => {
  if (word.endsWith('ی') || word.endsWith('ده')) return `${word}‌ای`;
  else if (word.endsWith('ء')) return `${word.slice(0, word.length - 1)}ئی`;
  else if (word.endsWith('ا')) return `${word}یی`;
  return `${word}ی`;
};

const pluralizePersian = (word) => `${word}‌ها`;

const appendPersianSuffix = ({ value, quantity }) => {
  if (quantity === UNIVERSAL) return appendPersianRelationLetter(value);
  else return pluralizePersian(value);
};

const appendSuffix = (input, { lng, quantity }) => {
  if (!input) return '';
  return lng === 'fa'
    ? appendPersianSuffix({ value: input, quantity })
    : pluralize(input);
};

const isPositiveVerb = (verb, { t, lng }) => {
  if (lng === 'fa')
    return (
      verb === t('positiveSingularVerb', { ns: 'general' }) ||
      verb === t('positivePluralVerb', { ns: 'general' })
    );
  else if (lng === 'en') return verb === t('positiveVerb', { ns: 'general' });
};

const appendComma = (text, lng) =>
  !text ? '' : `${text}${lng === 'fa' ? '،' : ','}`;
const appendDot = (text) => (!text ? '' : `${text}.`);

const type = ({
  text: initialText,
  previousText: initialPreviousText,
  typeInstance,
  handleEnd = () => {},
  beforeType,
  customValidator = () => true,
  textModifier = (a) => a,
}) => {
  const text = textModifier(initialText);
  const previousText = textModifier(initialPreviousText, true);
  const characterDifference = text.length - previousText.length;
  const positionDifference = findFirstDifferentPosition(text, previousText);
  const characterDeleteNumber = previousText.length - positionDifference;
  const newText = text.slice(positionDifference);
  if (!customValidator(characterDeleteNumber)) return;
  if (
    (characterDifference > 0 && characterDeleteNumber) ||
    (!(characterDifference > 0) && text.charAt(positionDifference))
  ) {
    if (beforeType) beforeType(TYPED_AND_REMOVED);
    typeInstance
      .deleteChars(characterDeleteNumber)
      .typeString(newText)
      .start()
      .callFunction(handleEnd);
  } else if (characterDifference > 0) {
    if (beforeType) beforeType(JUST_TYPED);
    typeInstance
      // .pauseFor(400)
      .typeString(newText)
      .start()
      .callFunction(handleEnd);
  } else {
    if (beforeType) beforeType(JUST_REMOVED);
    typeInstance
      .deleteChars(characterDeleteNumber)
      .start()
      .callFunction(() => handleEnd({ isJustRemoved: true }));
  }
};

const getFirstFragmentProperty = (isPredicative) =>
  isPredicative ? 'subject' : 'antecedent';
const getSecondFragmentProperty = (isPredicative) =>
  isPredicative ? 'predicate' : 'consequent';

const getLngTitle = lng => {
  switch (lng) {
    case 'fa':
      return 'فا'
    case 'en':
      return 'en';
    default:
      return ''; 
  }
}

const isBrowser = typeof window !== "undefined";

const getDefaultTheme = () => {
  if (!isBrowser) return 'light';
  if (!localStorage.getItem('previousTheme')) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return localStorage.getItem('previousTheme');
};

export {
  getStatementType,
  getBorderRadius,
  findFirstDifferentPosition,
  appendPersianSuffix,
  appendSuffix,
  isPositiveVerb,
  type,
  appendComma,
  appendDot,
  getFirstFragmentProperty,
  getSecondFragmentProperty,
  getLngTitle,
  isBrowser,
  getDefaultTheme,
};
