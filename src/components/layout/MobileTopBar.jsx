import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './MobileTopBar.css';

const MobileTopBar = ({ onOpenSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mobile-top-bar md:hidden">
      <div className="mobile-top-bar__left">
        <button 
          className="mobile-top-bar__menu-btn" 
          onClick={onOpenSidebar}
          aria-label="Buka menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="mobile-top-bar__brand">
          <div className="mobile-top-bar__logo-icon">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_balance_wallet</span>
          </div>
          <h1 className="mobile-top-bar__title">Tanciku</h1>
        </div>
      </div>
      <div className="mobile-top-bar__right">
        <button
          className="mobile-top-bar__theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default MobileTopBar;
