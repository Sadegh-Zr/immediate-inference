import * as React from 'react';
import './src/styles/global.css';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { LngContext, ThemeContext } from './src/contexts';

const containerClassName = 'container';

const RootElement = ({ children }) => {
    const { lng } = useI18next();
  const wasDark = JSON.parse(localStorage.getItem('previousTheme') === 'dark');
  const [theme, setTheme] = React.useState(wasDark ? 'dark' : 'light');
  const isComponentMounted = React.useRef(false);
  const scrollValue = React.useRef(0);
  const container = React.useRef();
  const themeClip = React.useRef();

  React.useEffect(() => {
    localStorage.setItem('previousTheme', theme);
  }, [theme]);

  const bindScroll = (element) => {
    const handleScroll = ({ currentTarget }) => {
      scrollValue.current = currentTarget.scrollTop;
      const containerList = [
        ...document.querySelectorAll(`.${containerClassName}`),
      ];
      if (containerList.length > 1) {
        container.current.scroll(0, scrollValue.current);
      }
    };
    element.addEventListener('scroll', handleScroll);
  };

  React.useEffect(() => {
    bindScroll(container.current);
  }, []);

  React.useEffect(() => {
    if (!isComponentMounted.current) {
      isComponentMounted.current = true;
      return;
    }
    themeClip.current.innerHTML = container.current.outerHTML;
    const innerContainer = themeClip.current.querySelector(
      `.${containerClassName}`
    );
    bindScroll(innerContainer);
    innerContainer.classList.toggle('-dark');
    innerContainer.scroll(0, scrollValue.current);
    themeClip.current.classList.add('-animated');
    setTimeout(() => {
      container.current.classList.toggle('-dark');
    }, 1000);
  }, [theme]);
 
  const handleThemeChangeAnimationEnd = ({ target, currentTarget }) => {
    if (target !== currentTarget) return;
    themeClip.current.innerHTML = '';
    container.current.scroll(0, scrollValue.current);
    themeClip.current.classList.remove('-animated');
    const themeChangeButton = document.getElementById('themeChangeButton');
    themeChangeButton.disabled = false;
  };

  return (
        <main className="main" >
          <div
            onAnimationEnd={handleThemeChangeAnimationEnd}
            ref={themeClip}
            className="themeClip"
          />
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <LngContext.Provider value={lng}>
              <div
                ref={container}
                className={`${containerClassName}${wasDark ? ' -dark' : ''}`}
              >
                {children}
              </div>
            </LngContext.Provider>
          </ThemeContext.Provider>
        </main>

  );
}

export const wrapRootElement = ({ element }) => {
    return (
        <RootElement>
            {element}
        </RootElement>
    )
}
