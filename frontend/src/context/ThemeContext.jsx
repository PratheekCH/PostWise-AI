import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
  toggleTheme: () => null,
  isDark: false,
});

export const ThemeProvider = ({
  children,
  defaultTheme = 'light',
  storageKey = 'postwise_theme',
}) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved || defaultTheme;
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemDark ? 'dark' : 'light');
      setIsDark(systemDark);
      return;
    }

    root.classList.add(theme);
    setIsDark(theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(storageKey, next);
      return next;
    });
  };

  const handleSetTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
