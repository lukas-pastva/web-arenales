import { useState, useEffect } from 'react';

const THEME_KEY = 'arenales-theme';
const THEMES = ['light', 'dark', 'superdark', 'auto'];

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme) {
  return theme === 'auto' ? getSystemTheme() : theme;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', resolveTheme(theme));
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return THEMES.includes(saved) ? saved : 'dark';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (t) => {
    if (THEMES.includes(t)) setThemeState(t);
  };

  return { theme, setTheme, THEMES };
}
