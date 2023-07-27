import * as React from 'react';
import { CONDITIONAL } from '../../constants';
import StatementForm from '../StatementForm';
import * as styles from './ConditionalStatement.module.css';
import {
  useDebounceRef,
  useLanguage,
  useStatementFunctions,
} from '../../hooks';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import TypeWriter from 'typewriter-effect/dist/core';
import { appendComma, appendDot, type } from '../../utils';

const hideCursor = (text) => text?.classList.add(styles['hidden']);
const showCursor = (text) => text?.classList.remove(styles['hidden']);

const mergeCursors = (a, b) => {
  hideCursor(a);
  showCursor(b);
};

const ConditionalStatement = ({
  antecedent,
  consequent,
  updateAntecedent,
  updateConsequent,
  qualityType,
  updateQualityType,
  quantityType,
  updateQuantityType,
}) => {
  const { lng } = useLanguage();
  const { t } = useTranslation('general');
  const { getConditionalQuantityText, getConditionalQualityText } =
    useStatementFunctions({ t, lng });

  const [debouncedAntecedent, getLatestAntecedent] = useDebounceRef(
    antecedent,
    500
  );
  const [debouncedConsequent, getLatestConsequent] = useDebounceRef(
    consequent,
    500
  );

  const quantityTextInstance = React.useRef();
  const qualityTextInstance = React.useRef();
  const thatIfTextInstance = React.useRef();
  const antecedentTextInstance = React.useRef();
  const thenTextInstance = React.useRef();
  const consequentTextInstance = React.useRef();

  const quantityText = React.useRef();
  const qualityText = React.useRef();
  const antecedentText = React.useRef();
  const consequentText = React.useRef();
  const thatIfText = React.useRef('');
  const thenText = React.useRef('');

  const isQuantityTyped = React.useRef(false);
  const isQualityTyped = React.useRef(false);
  const isAntecedentTyped = React.useRef(false);
  const isConsequentTyped = React.useRef(false);
  const isThenTyped = React.useRef(false);
  const isThatIfTyped = React.useRef(false);

  const previousAntecedent = React.useRef('');
  const previousQuantity = React.useRef('');
  const previousQuality = React.useRef('');
  const previousConsequent = React.useRef('');
  const previousQuantityTypeAfterAnimationEnd = React.useRef('');

  const preventTrigger = React.useRef(false);

  // Initialize Typers
  React.useEffect(() => {
    const hiddenCursorOptions = {
      cursorClassName: `Typewriter__cursor ${styles.hidden}`,
    };
    quantityTextInstance.current = new TypeWriter(quantityText.current, {
      cursorClassName: `Typewriter__cursor ${styles['hidden']}`,
    });
    qualityTextInstance.current = new TypeWriter(
      qualityText.current,
      hiddenCursorOptions
    );
    thatIfTextInstance.current = new TypeWriter(
      thatIfText.current,
      hiddenCursorOptions
    );
    antecedentTextInstance.current = new TypeWriter(
      antecedentText.current,
      hiddenCursorOptions
    );
    thenTextInstance.current = new TypeWriter(
      thenText.current,
      hiddenCursorOptions
    );
    consequentTextInstance.current = new TypeWriter(
      consequentText.current,
      hiddenCursorOptions
    );
  }, []);

  const handleAntecedentEnd = () => {
    if (!getLatestConsequent()) {
      preventTrigger.current = false;
      return;
    }
    if (isConsequentTyped.current) return;
    mergeCursors(antecedentText.current, thenText.current);
    isThenTyped.current = true;
    thenTextInstance.current
      .typeString(t('then'))
      .start()
      .callFunction(() => {
        preventTrigger.current = false;
        mergeCursors(thenText.current, consequentText.current);
        isConsequentTyped.current = true;
        consequentTextInstance.current
          .typeString(`${appendDot(getLatestConsequent())}`)
          .start();
        previousConsequent.current = getLatestConsequent();
      });
  };

  React.useEffect(() => {
    // Prevent Initial Typing
    if (!debouncedAntecedent && !isQuantityTyped.current) return;

    const text = getConditionalQuantityText({
      value: quantityType,
      quality: qualityType,
    });
    const previousText = getConditionalQuantityText({
      value: previousQuantity.current,
      quality: previousQuality.current || qualityType,
    });
    // prevent same typing
    if (text === previousText) return;
    const handleEnd = () => {
      previousQuantityTypeAfterAnimationEnd.current = quantityType;
      isQuantityTyped.current = true;
      if (isQualityTyped.current) hideCursor(quantityText.current);
      else {
        preventTrigger.current = true;
        isQualityTyped.current = true;
        mergeCursors(quantityText.current, qualityText.current);
        qualityTextInstance.current
          .typeString(
            getConditionalQualityText({
              value: qualityType,
              quantity: quantityType,
            })
          )
          .start()
          .callFunction(() => {
            mergeCursors(qualityText.current, thatIfText.current);
            thatIfTextInstance.current
              .typeString(t('thatIf'))
              .start()
              .callFunction(() => {
                isThatIfTyped.current = true;
                mergeCursors(thatIfText.current, antecedentText.current);
                isAntecedentTyped.current = true;
                antecedentTextInstance.current
                  .typeString(appendComma(getLatestAntecedent(), lng))
                  .start()
                  .callFunction(handleAntecedentEnd);
                previousAntecedent.current = getLatestAntecedent();
              });
          });
        previousQuality.current = qualityType;
      }
    };

    showCursor(quantityText.current);
    type({
      text,
      previousText,
      handleEnd,
      typeInstance: quantityTextInstance.current,
    });
    previousQuantity.current = quantityType;
  }, [debouncedAntecedent, debouncedConsequent, quantityType, qualityType]);

  // Handle Antecedent Typer
  React.useEffect(() => {
    if (!isThatIfTyped.current) return;
    if (previousAntecedent.current === debouncedAntecedent) return;

    type({
      text: debouncedAntecedent,
      previousText: previousAntecedent.current,
      typeInstance: antecedentTextInstance.current,
      handleEnd: handleAntecedentEnd,
      textModifier: (a) => appendComma(a, lng),
    });
    previousAntecedent.current = debouncedAntecedent;
  }, [debouncedAntecedent]);

  // Handle Quality Typer
  React.useEffect(() => {
    if (!isQuantityTyped.current) return;
    const text = getConditionalQualityText({
      value: qualityType,
      quantity: quantityType,
    });
    const previousText = getConditionalQualityText({
      value: previousQuality.current,
      quantity: previousQuantity.current || quantityType,
    });
    if (text === previousText) return;

    const handleEnd = () => {
      hideCursor(qualityText.current);
    };

    showCursor(qualityText.current);

    type({
      text,
      previousText,
      handleEnd,
      typeInstance: qualityTextInstance.current,
    });
    previousQuality.current = qualityType;
  }, [qualityType, quantityType]);

  // Handle Consequent Typer
  React.useEffect(() => {
    if (preventTrigger.current) return;
    const text = debouncedConsequent;
    if (text === previousConsequent.current) return;
    if (!debouncedAntecedent && !isConsequentTyped.current) {
      previousConsequent.current = text;
      return;
    }
    if (!isAntecedentTyped.current) return;
    const typeConsequent = () => {
      isConsequentTyped.current = true;
      type({
        text,
        previousText: previousConsequent.current,
        typeInstance: consequentTextInstance.current,
        textModifier: appendDot,
      });
      previousConsequent.current = debouncedConsequent;
    };
    hideCursor(antecedentText.current);
    if (!isThenTyped.current) {
      isThenTyped.current = true;
      thenTextInstance.current
        .pauseFor()
        .typeString(t('then'))
        .start()
        .callFunction(() => {
          mergeCursors(thenText.current, consequentText.current);
          typeConsequent();
        });
    } else {
      showCursor(consequentText.current);
      typeConsequent();
    }
  }, [debouncedAntecedent, debouncedConsequent]);

  const handleAntecedentFocus = () => {
    if (isQuantityTyped.current) return;
    showCursor(quantityText.current);
  };

  const handleAntecedentBlur = () => {
    hideCursor(quantityText.current);
  };
  return (
    <div className={styles.ConditionalStatement}>
      <div className={styles.typeWriter}>
        <span
          className={`${styles.typeWriter__item} ${styles['hidden']}`}
          ref={quantityText}
        />
        <span
          className={`${styles.typeWriter__item} ${styles['hidden']}`}
          ref={qualityText}
        />
        <span
          className={`${styles.typeWriter__item} ${styles['hidden']}`}
          ref={thatIfText}
        />
        <span
          className={`${styles.typeWriter__item} ${styles['hidden']}`}
          ref={antecedentText}
        />
        <span
          className={`${styles.typeWriter__item} ${styles['hidden']}`}
          ref={thenText}
        />
        <span
          className={`${styles.typeWriter__item} ${styles['hidden']}`}
          ref={consequentText}
        />
      </div>
      <StatementForm
        type={CONDITIONAL}
        onFirstFragmentFocus={handleAntecedentFocus}
        onFirstFragmentBlur={handleAntecedentBlur}
        firstFragment={antecedent}
        secondFragment={consequent}
        updateFirstFragment={updateAntecedent}
        updateSecondFrament={updateConsequent}
        quantityType={quantityType}
        updateQuantityType={updateQuantityType}
        qualityType={qualityType}
        updateQualityType={updateQualityType}
      />
    </div>
  );
};

export default ConditionalStatement;
