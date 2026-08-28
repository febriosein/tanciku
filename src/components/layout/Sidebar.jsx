import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'grid_view', end: true },
  { to: '/transactions', label: 'Transaksi', icon: 'swap_horiz' },
  { to: '/statistics', label: 'Statistik', icon: 'bar_chart' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop md:hidden" 
          onClick={onClose} 
          aria-hidden="true" 
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open-mobile' : ''}`}>
        {/* Logo */}
        <div className="sidebar__logo-wrapper">
          <img src="/favicon.png" alt="Tanciku Logo" className="sidebar__logo-img" />
          <span className="sidebar__logo-text">Tanciku</span>
        </div>

        {/* Section label */}
        <p className="sidebar__section-label">Menu</p>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
              }
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="sidebar__nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
