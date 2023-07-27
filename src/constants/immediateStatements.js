import { AFFIRMATIVE, NEGATIVE } from './qualityTypes';
import { PARTICULAR, UNIVERSAL } from './quantityTypes';

const PARTS_RELATION = {
  equal: 'EQUAL',
  firstFragmentProperSubset: 'FIRST_FRAGMENT_PROPER_SUBSET',
  secondFragmentProperSubset: 'SECOND_FRAGMENT_PROPER_SUBSET',
  disjoint: 'DISJOINT',
  overlapping: 'OVERLAPPING',
};

const UNIVERSAL_AFFIRMATIVE = {
  quality: AFFIRMATIVE,
  quantity: UNIVERSAL,
};

const UNIVERSAL_NEGATIVE = {
  quality: NEGATIVE,
  quantity: UNIVERSAL,
};

const PARTICULAR_AFFIRMATIVE = {
  quality: AFFIRMATIVE,
  quantity: PARTICULAR,
};

const PARTICULAR_NEGATIVE = {
  quality: NEGATIVE,
  quantity: PARTICULAR,
};

const CONVERSION = 'CONVERSION';
const OBVERTED_CONTRAPOSITION = 'OBVERTED_CONTRAPOSITION';
const CONTRAPOSITION = 'CONTRAPOSITION';
const OBVERTION = 'OBVERTION';
const FIRST_FRAGMENT_COMPLEMENTION = 'FIRST_FRAGMENT_COMPLEMENTION';
const BOTH_COMPLEMENTION = 'BOTH_COMPLEMENTION';

export const TRUE_IMMEDIATE_STATEMENTS = [
  {
    type: UNIVERSAL_AFFIRMATIVE,
    conversed: PARTICULAR_AFFIRMATIVE, // عکس مستوی
    contraposited: UNIVERSAL_NEGATIVE, // عکس نقیض مخالف
    obvertedContaposition: UNIVERSAL_AFFIRMATIVE, // عکس نقیض موافق
    obverted: UNIVERSAL_NEGATIVE, // نقض محمول
    complementedFirstFragment: PARTICULAR_NEGATIVE, // نقض موضوع
    complementedBoth: PARTICULAR_AFFIRMATIVE, // نقض طرفین
  },
  {
    type: PARTICULAR_AFFIRMATIVE,
    conversed: PARTICULAR_AFFIRMATIVE,
    contraposited: null,
    obvertedContaposition: null,
    obverted: PARTICULAR_NEGATIVE,
    complementedFirstFragment: null,
    complementedBoth: null,
  },
  {
    type: UNIVERSAL_NEGATIVE,
    conversed: UNIVERSAL_NEGATIVE,
    contraposited: PARTICULAR_AFFIRMATIVE,
    obvertedContaposition: PARTICULAR_NEGATIVE,
    obverted: UNIVERSAL_AFFIRMATIVE,
    complementedFirstFragment: PARTICULAR_AFFIRMATIVE,
    complementedBoth: PARTICULAR_NEGATIVE,
  },
  {
    type: PARTICULAR_NEGATIVE,
    conversed: null,
    contraposited: PARTICULAR_AFFIRMATIVE,
    obvertedContaposition: PARTICULAR_NEGATIVE,
    obverted: PARTICULAR_AFFIRMATIVE,
    complementedFirstFragment: null,
    complementedBoth: null,
  },
];

export {
  UNIVERSAL_AFFIRMATIVE,
  UNIVERSAL_NEGATIVE,
  PARTICULAR_AFFIRMATIVE,
  PARTICULAR_NEGATIVE,
  CONVERSION,
  CONTRAPOSITION,
  OBVERTION,
  OBVERTED_CONTRAPOSITION,
  FIRST_FRAGMENT_COMPLEMENTION,
  BOTH_COMPLEMENTION,
};
