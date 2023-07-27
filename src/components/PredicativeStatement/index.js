import * as React from 'react';
import {
  useDebounceRef,
  useLanguage,
  useStatementFunctions,
} from '../../hooks';
import StatementForm from '../StatementForm';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import * as styles from './PredicativeStatement.module.css';
import { appendSuffix, type } from '../../utils';
import TypeWriter from 'typewriter-effect/dist/core';
import {
  JUST_REMOVED,
  JUST_TYPED,
  PREDICATIVE,
  TYPED_AND_REMOVED,
} from '../../constants';

const indentCursor = (cursor) => {
  cursor.style.opacity = '0 !important';
  cursor.classList.remove(styles.subjectCursor);
  cursor.style.opacity = '';
};

const mergeCursors = (a, b) => {
  a.style.visibility = 'hidden';
  indentCursor(b);
  b.style.visibility = 'visible';
};

const PredicativeStatement = ({
  subject,
  predicate,
  qualityType,
  quantityType,
  updateSubject,
  updatePredicate,
  updateQuantityType,
  updateQualityType,
}) => {
  const { lng, isRtl } = useLanguage();
  const { t } = useTranslation(['index', 'general']);
  const { getQualityText, getQuantityText } = useStatementFunctions({ t, lng });
  const [debouncedSubject] = useDebounceRef(subject, 500);
  const [debouncedPredicate, getLatestDebouncedPredicate] = useDebounceRef(
    predicate,
    500
  );

  const quantityText = React.useRef();
  const quantityTextInstance = React.useRef();

  const subjectText = React.useRef();
  const subjectTextInstance = React.useRef();

  const qualityText = React.useRef();
  const qualityTextInstance = React.useRef();

  const predicateText = React.useRef();
  const predicateTextInstance = React.useRef();

  const latestSubjectText = React.useRef('');
  const latestPredicateText = React.useRef('');

  const isSubjectTyped = React.useRef(false);
  const isPredicateTyped = React.useRef(false);
  const isQualityTyped = React.useRef(false);
  const isQuantityTyped = React.useRef(false);

  const previousQuantityType = React.useRef('');
  const previousQuantityTypeAfterAnimationEnd = React.useRef(''); // for using simultaneously with other typer
  const previousQualityType = React.useRef('');
  const preventTrigger = React.useRef(false);

  // Initialize Typers
  React.useEffect(() => {
    const hiddenCursorOptions = {
      cursorClassName: `Typewriter__cursor ${styles.subjectCursor}`,
    };
    quantityTextInstance.current = new TypeWriter(quantityText.current, {
      cursorClassName: `Typewriter__cursor ${styles.hiddenCursor}`,
    });
    subjectTextInstance.current = new TypeWriter(
      subjectText.current,
      hiddenCursorOptions
    );
    predicateTextInstance.current = new TypeWriter(
      predicateText.current,
      hiddenCursorOptions
    );
    qualityTextInstance.current = new TypeWriter(
      qualityText.current,
      hiddenCursorOptions
    );
  }, []);

  const handleSubjectEnd = ({ isJustRemoved }) => {
    if (!subjectText.current) return; // Page Switch Before Animation End
    const subjectCursor = subjectText.current.querySelector(
      '.Typewriter__cursor'
    );
    const predicateCursor = predicateText.current.querySelector(
      '.Typewriter__cursor'
    );
    const qualityCursor = qualityText.current.querySelector(
      '.Typewriter__cursor'
    );

    if (isJustRemoved) {
      subjectCursor.style.opacity = '0 !important';
      subjectCursor.classList.add(styles.subjectCursor);
      subjectCursor.style.opacity = '';
      subjectCursor.style.visibility = 'hidden';
      return;
    }

    preventTrigger.current = false;

    // Using a function to get the latest value not the old one bound to the useEffect
    const debouncedPredicateRef = getLatestDebouncedPredicate();
    if (!debouncedPredicateRef) {
      // No Predicate has been entered so we make its cursor ready to type!
      subjectCursor.style.visibility = 'hidden';
      if (isRtl) predicateCursor.style.visibility = 'visible';
      else if (!isQualityTyped.current)
        qualityCursor.style.visibility = 'visible';
    } else if (!isPredicateTyped.current) {
      // there's a predicate value but it's not typed yet so we type it!
      mergeCursors(subjectCursor, isRtl ? predicateCursor : qualityCursor);
      isPredicateTyped.current = true;
      isQualityTyped.current = true;
      latestPredicateText.current = debouncedPredicateRef;
      const quality = getQualityText({
        value: qualityType,
        quantity: quantityType,
      });
      previousQualityType.current = qualityType;
      (isRtl ? predicateTextInstance : qualityTextInstance).current
        .pauseFor(0)
        .typeString(isRtl ? debouncedPredicateRef : quality)
        .start()
        .callFunction(() => {
          const toMergeCursors = isRtl
            ? [predicateCursor, qualityCursor]
            : [qualityCursor, predicateCursor];
          mergeCursors(...toMergeCursors);
          (isRtl ? qualityTextInstance : predicateTextInstance).current
            .pauseFor(0)
            .typeString(isRtl ? `${quality}.` : `${debouncedPredicateRef}.`)
            .start();
        });
    }
    // Everything is typed so we just hide the subject cursor after the type is finished
    else {
      subjectCursor.style.visibility = 'hidden';
    }
  };

  // Handle Quantity Typer
  React.useEffect(() => {
    const text = getQuantityText({ value: quantityType, quality: qualityType });

    // Prevent Initial Typing
    if (!debouncedSubject && !isQuantityTyped.current) return;

    // Prevent Same Typing
    if (
      getQuantityText({
        value: previousQuantityType.current,
        quality: previousQualityType.current || qualityType,
      }) === text
    )
      return;
    const quantityCursor = quantityText.current.querySelector(
      '.Typewriter__cursor'
    );
    const subjectCursor = subjectText.current.querySelector(
      '.Typewriter__cursor'
    );

    const handleEnd = () => {
      previousQuantityTypeAfterAnimationEnd.current = quantityType;
      isQuantityTyped.current = true;
      quantityCursor.style.visibility = 'hidden';
      if (!debouncedSubject) {
        subjectCursor.style.visibility = 'visible'; // Make Subject Ready To Type
      } else if (!isSubjectTyped.current) {
        // There is a Subject Value but it's not typed yet
        isSubjectTyped.current = true;
        mergeCursors(quantityCursor, subjectCursor);
        latestSubjectText.current = debouncedSubject;
        preventTrigger.current = true;
        subjectTextInstance.current
          .pauseFor(0)
          .typeString(
            appendSuffix(debouncedSubject, { lng, quantity: quantityType })
          )
          .start()
          .callFunction(handleSubjectEnd);
      }
    };

    const beforeType = (type) => {
      if (type === JUST_TYPED) preventTrigger.current = true;
    };

    quantityCursor.style.visibility = 'visible';
    type({
      text,
      previousText: getQuantityText({
        value: previousQuantityType.current,
        quality: previousQualityType.current,
      }),
      beforeType,
      typeInstance: quantityTextInstance.current,
      handleEnd,
    });
    previousQuantityType.current = quantityType;
  }, [quantityType, debouncedSubject, qualityType, debouncedPredicate]);

  // Handle Subject Cursor
  React.useEffect(() => {
    let text = debouncedSubject;

    // prevent same typing
    if (
      appendSuffix(latestSubjectText.current, {
        lng,
        quantity: previousQuantityTypeAfterAnimationEnd.current,
      }) === appendSuffix(text, { lng, quantity: quantityType })
    )
      return;

    // prevent typing before the quantity being typed
    if (!isQuantityTyped.current) return;

    // Make Cursor Visible for changes
    const cursor = subjectText.current.querySelector('.Typewriter__cursor');
    cursor.style.visibility = 'visible';

    // Typing from the blank, we make a indent to make a space between subject cursor and quantity cursor
    if (text && !latestSubjectText.current) indentCursor(cursor);

    const beforeType = (state) => {
      isSubjectTyped.current = state !== JUST_REMOVED;
    };

    type({
      text,
      previousText: latestSubjectText.current,
      textModifier: (value, isForPrevious) =>
        appendSuffix(value, {
          lng,
          quantity: isForPrevious
            ? previousQuantityTypeAfterAnimationEnd.current
            : quantityType,
        }),
      typeInstance: subjectTextInstance.current,
      handleEnd: handleSubjectEnd,
      beforeType,
    });
    latestSubjectText.current = text;
  }, [
    debouncedSubject,
    debouncedPredicate,
    qualityType,
    isRtl,
    getQualityText,
    getQuantityText,
    quantityType,
  ]);

  // Handle Predicate Cursor
  React.useEffect(() => {
    let text = debouncedPredicate;
    if (preventTrigger.current) return;

    // Prevent Typing Before Subject Being Typed
    if (!debouncedSubject && !isPredicateTyped.current) {
      latestPredicateText.current = text;
      return;
    }

    // Prevent Typing Before Quality Being Typed in English Language
    if (!isQualityTyped.current && !isRtl) return;

    // Prevent Same Typing
    if (latestPredicateText.current === text) return;
    isPredicateTyped.current = true;
    const cursor = predicateText.current.querySelector('.Typewriter__cursor');
    const subjectCursor = subjectText.current.querySelector(
      '.Typewriter__cursor'
    );
    const qualityCursor = qualityText.current.querySelector(
      '.Typewriter__cursor'
    );

    if (text && !latestPredicateText.current) {
      indentCursor(cursor);
    } else if (text) {
      cursor.style.visibility = 'visible';
    }
    (isRtl ? subjectCursor : qualityCursor).style.visibility = 'hidden';

    const handleEnd = () => {
      if (!isRtl) return;
      if (!text) {
        if (isQualityTyped.current) indentCursor(cursor);
        else {
          qualityCursor.style.visibility = 'hidden';
          cursor.style.visibility = 'visible';
          cursor.classList.add(styles.subjectCursor);
        }
      } else {
        cursor.style.visibility = 'hidden';
        qualityCursor.style.visibility = 'visible';
        if (!isQualityTyped.current) {
          indentCursor(qualityCursor);
          const quality = getQualityText({
            value: qualityType,
            quantity: quantityType,
          });
          isQualityTyped.current = true;
          previousQualityType.current = qualityType;
          qualityTextInstance.current
            .pauseFor(0)
            .typeString(`${quality}.`)
            .start();
        }
      }
    };

    const customValidator = (characterDeleteNumber) => {
      if (!text) {
        isPredicateTyped.current = false;
        if (isRtl) {
          isQualityTyped.current = false;
        }
        (isRtl ? qualityTextInstance : predicateTextInstance).current
          .pauseFor(0)
          .deleteAll()
          .start()
          .callFunction(() => {
            if (!isRtl) {
              cursor.classList.add(styles.subjectCursor);
              return;
            }
            qualityCursor.classList.add(styles.subjectCursor);
            predicateTextInstance.current
              .deleteChars(characterDeleteNumber)
              .start()
              .callFunction(handleEnd);
          });
      }
      return Boolean(text);
    };

    const addDotIfEnglish = (input) => (isRtl ? input : `${input}.`);

    type({
      text,
      previousText: latestPredicateText.current,
      textModifier: addDotIfEnglish,
      handleEnd,
      customValidator,
      typeInstance: predicateTextInstance.current,
    });
    latestPredicateText.current = text;
  }, [qualityType, debouncedPredicate, debouncedSubject, isRtl]);

  // Handle Quality Cursor
  React.useEffect(() => {
    if (preventTrigger.current) return;

    // Prevent Typing without having a predicate value
    if (!debouncedPredicate) {
      if (isRtl) previousQualityType.current = qualityType;
      return;
    }

    if (!isQuantityTyped.current) return;

    // Prevent Same Typing
    if (
      getQualityText({
        value: previousQualityType.current,
        quantity: previousQuantityTypeAfterAnimationEnd.current,
      }) === getQualityText({ value: qualityType, quantity: quantityType })
    ) {
      if (previousQualityType.current !== qualityType)
        previousQualityType.current = qualityType;
      return;
    }

    isQualityTyped.current = true;
    const text = `${getQualityText({
      value: qualityType,
      quantity: quantityType,
    })}${isRtl ? '.' : ''}`;

    const cursor = qualityText.current.querySelector('.Typewriter__cursor');
    const predicateCursor = predicateText.current.querySelector(
      '.Typewriter__cursor'
    );
    const handleEnd = () => {
      if (isRtl) return;
      cursor.style.visibility = 'hidden';
      predicateCursor.style.visibility = 'visible';
      if (!latestPredicateText.current && !isPredicateTyped.current) {
        indentCursor(predicateCursor);
        isPredicateTyped.current = true;
        latestPredicateText.current = debouncedPredicate;
        predicateTextInstance.current
          .pauseFor(0)
          .typeString(`${debouncedPredicate}.`)
          .start();
      }
    };
    if (previousQualityType.current) {
      // if (lng === 'en' && quantityType === UNIVERSAL) return;
      qualityTextInstance.current
        .deleteAll()
        .typeString(text)
        .start()
        .callFunction(handleEnd);
    } else {
      qualityTextInstance.current
        .pauseFor(0)
        .typeString(text)
        .start()
        .callFunction(handleEnd);
    }
    previousQualityType.current = qualityType;
  }, [qualityType, debouncedPredicate, quantityType, debouncedSubject]);

  const handleSubjectFocus = () => {
    if (isQuantityTyped.current) return;
    const quantityCursor = quantityText.current.querySelector(
      '.Typewriter__cursor'
    );
    quantityCursor.style.visibility = 'visible';
  };

  const handleSubjectBlur = () => {
    const quantityCursor = quantityText.current.querySelector(
      '.Typewriter__cursor'
    );
    if (quantityCursor.style.visibility === 'visible') {
      quantityCursor.style.visibility = 'hidden';
    }
  };
  return (
    <div className={styles.PredicativeStatement}>
      <div className={styles.typeWriter}>
        <span className={styles.typeWriter__item} ref={quantityText} />
        <span className={styles.typeWriter__item} ref={subjectText} />
        {isRtl ? (
          <>
            <span className={styles.typeWriter__item} ref={predicateText} />
            <span className={styles.typeWriter__item} ref={qualityText} />
          </>
        ) : (
          <>
            <span className={styles.typeWriter__item} ref={qualityText} />
            <span className={styles.typeWriter__item} ref={predicateText} />
          </>
        )}
      </div>
      <StatementForm
        type={PREDICATIVE}
        onFirstFragmentFocus={handleSubjectFocus}
        onFirstFragmentBlur={handleSubjectBlur}
        firstFragment={subject}
        secondFragment={predicate}
        updateFirstFragment={updateSubject}
        updateSecondFrament={updatePredicate}
        quantityType={quantityType}
        updateQuantityType={updateQuantityType}
        qualityType={qualityType}
        updateQualityType={updateQualityType}
      />
    </div>
  );
};

export default PredicativeStatement;
