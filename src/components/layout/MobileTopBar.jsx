import React from 'react';
import './MobileTopBar.css';

const MobileTopBar = ({ onOpenSidebar }) => {
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
        <h1 className="mobile-top-bar__title">Tanciku</h1>
      </div>
      <div className="mobile-top-bar__avatar">
        <span className="material-symbols-outlined">person</span>
      </div>
    </header>
  );
};

export default MobileTopBar;
