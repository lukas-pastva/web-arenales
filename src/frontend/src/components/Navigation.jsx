import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import './Navigation.css';

const themeIcons = {
  light: '\u2600',
  dark: '\u263D',
  superdark: '\u25CF',
  auto: '\u25D1',
};

const themeCycle = ['light', 'dark', 'superdark', 'auto'];

const navItems = [
  { path: '/latest', label: 'Latest', icon: '\u25C9' },
  { path: '/combined-24h', label: 'Combined 24h', icon: '\u29BE' },
  { path: '/combined-daylight', label: 'Combined Daylight', icon: '\u25D0' },
  { path: '/settings', label: 'Settings', icon: '\u2699' },
];

const BOTTOM_BAR_VISIBLE = 4;

function Navigation() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const idx = themeCycle.indexOf(theme);
    setTheme(themeCycle[(idx + 1) % themeCycle.length]);
  };

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const bottomItems = navItems.slice(0, BOTTOM_BAR_VISIBLE);
  const overflowItems = navItems.slice(BOTTOM_BAR_VISIBLE);

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <nav className="sidebar" aria-label="Main navigation">
        <div className="sidebar-brand">
          <div className="brand-mark">W</div>
          <span className="sidebar-brand-text">Web Arenales</span>
        </div>
        <ul className="sidebar-links">
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{icon}</span>
                <span className="sidebar-label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          className="sidebar-theme-btn"
          onClick={cycleTheme}
          aria-label={`Theme: ${theme}`}
          title={`Theme: ${theme}`}
        >
          <span className="sidebar-icon">{themeIcons[theme]}</span>
          <span className="sidebar-label">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="bottombar" aria-label="Mobile navigation">
        {bottomItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `bottombar-item ${isActive ? 'active' : ''}`}
          >
            <span className="bottombar-icon">{icon}</span>
            <span className="bottombar-label">{label}</span>
          </NavLink>
        ))}
        <button
          className="bottombar-item"
          onClick={cycleTheme}
          aria-label={`Theme: ${theme}`}
        >
          <span className="bottombar-icon">{themeIcons[theme]}</span>
          <span className="bottombar-label">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
        </button>
        {overflowItems.length > 0 && (
          <>
            <button
              className={`bottombar-item bottombar-more ${moreOpen ? 'active' : ''}`}
              onClick={() => setMoreOpen(!moreOpen)}
              aria-label="More navigation items"
            >
              <span className="bottombar-icon">{'\u22EF'}</span>
              <span className="bottombar-label">More</span>
            </button>

            {moreOpen && (
              <>
                <div className="overflow-backdrop" onClick={() => setMoreOpen(false)} />
                <div className="overflow-menu">
                  {overflowItems.map(({ path, label, icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      className={({ isActive }) => `overflow-item ${isActive ? 'active' : ''}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      <span className="overflow-icon">{icon}</span>
                      <span className="overflow-label">{label}</span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </nav>
    </>
  );
}

export default Navigation;
