import * as React from 'react';
import * as styles from './Switch.module.css';
import { getBorderRadius } from '../../utils';
import { useLanguage } from '../../hooks';

const Switch = ({
  options,
  value,
  onChange,
  isVertical,
  optionPadding,
  optionStyle,
  fontSize = 'var(--font-size-primary)',
  radiusRight,
  colorful,
}) => {
  const isComponentMounted = React.useRef(false);
  const switchAnimator = React.useRef();
  const container = React.useRef();
  const { isRtl } = useLanguage();
  const renderOptions = () =>
    options.map((option) => {
      const handleClick = () => {
        onChange(option.value);
      };
      const selectedClassName = isComponentMounted.current
        ? 'selected'
        : 'selectedInitial';
      return (
        <button
          title={option.title} /* Fix Layout Size Change On Switch Change */
          type="button"
          onClick={handleClick}
          key={option.value}
          className={`${styles.Switch__option} ${
            value === option.value ? styles[selectedClassName] : ''
          }`}
          style={{ padding: optionPadding, fontSize, ...optionStyle }}
        >
          {option.title}
        </button>
      );
    });

  React.useEffect(() => {
    const selectedClassName = isComponentMounted.current
      ? 'selected'
      : 'selectedInitial';
    const selectedOption = container.current.querySelector(
      `.${styles[selectedClassName]}`
    );
    const borderRadius = getBorderRadius(selectedOption);
    const isFirstOptionSelected =
      selectedOption.previousSibling === switchAnimator.current;
    const translateValue = isFirstOptionSelected
      ? isVertical
        ? '0%'
        : isRtl
        ? '0%'
        : '0'
      : isVertical
      ? '100%'
      : isRtl
      ? '-100%'
      : '100%';
    const translateDirection = isVertical ? 'Y' : 'X';
    if (!isComponentMounted.current) {
      isComponentMounted.current = true;
      switchAnimator.current.style.borderRadius = borderRadius;
      if (colorful)
        switchAnimator.current.style.borderColor = `var(--color-${
          isFirstOptionSelected ? 'success' : 'error'
        })`;
      switchAnimator.current.style.opacity = 1;
      [
        ...container.current.querySelectorAll(`.${styles.Switch__option}`),
      ].forEach((option, index) => {
        const borderValue = isVertical
          ? !index
            ? 'borderBottomColor'
            : 'borderTopColor'
          : !index
          ? isRtl
            ? 'borderLeftColor'
            : 'borderRightColor'
          : isRtl
          ? 'borderRightColor'
          : 'borderLeftColor';
        option.style[borderValue] = 'transparent';
      });
      switchAnimator.current.style.transform = `translate${translateDirection}(${translateValue})`;
      return;
    }
    switchAnimator.current.style.transition = '0.3s all ease-out';
    if (colorful)
      switchAnimator.current.style.borderColor =
        switchAnimator.current.style.borderRadius = `var(--color-${
          isFirstOptionSelected ? 'success' : 'error'
        })`;
    switchAnimator.current.style.borderRadius = borderRadius;
    switchAnimator.current.style.transform = `translate${translateDirection}(${translateValue})`;
  }, [value, isVertical, colorful]);
  return (
    <div
      ref={container}
      className={`${styles.Switch} ${isVertical ? styles.vertical : ''} ${
        radiusRight ? styles.radiusRight : ''
      } ${colorful ? styles.colorful : ''}`}
    >
      <div ref={switchAnimator} className={styles.Switch__animator} />
      {renderOptions()}
    </div>
  );
};

export default Switch;
