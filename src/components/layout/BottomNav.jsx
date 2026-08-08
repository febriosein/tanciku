import React from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', icon: 'dashboard', end: true },
  { to: '/transactions', label: 'Transaksi', icon: 'receipt_long' },
  { to: '/statistics', label: 'Statistik', icon: 'leaderboard' },
  { to: '/settings', label: 'Setelan', icon: 'settings' },
];

const BottomNav = () => {
  return (
    <nav className="bottom-nav md:hidden" role="navigation">
      {NAV_ITEMS.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
          }
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
