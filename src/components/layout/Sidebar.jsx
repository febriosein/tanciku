import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'grid_view', end: true },
  { to: '/transactions', label: 'Transaksi', icon: 'swap_horiz' },
  { to: '/statistics', label: 'Statistik', icon: 'bar_chart' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { profile } = useTransactions();
  const userInitial = (profile?.name || 'T').substring(0, 2).toUpperCase();

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
        {/* Brand Logo Area */}
        <div className="sidebar__brand-area">
          <div className="sidebar__brand-logo-frame">
            <div className="sidebar__brand-logo-inner">
              <svg className="sidebar__brand-svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-16 0V6" />
                <circle cx="18" cy="13" fill="currentColor" r="1" />
              </svg>
            </div>
          </div>
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-title">
              Tanciku
              <span className="sidebar__brand-pulse" />
            </span>
            <span className="sidebar__brand-subtitle">Financial Suite</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="sidebar__menu-section">
          <div className="sidebar__section-label">Menu Utama</div>

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
                <span className="material-symbols-outlined sidebar__nav-icon">{icon}</span>
                <span className="sidebar__nav-label">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Status Widget */}
        <div className="sidebar__footer-widget">
          <div className="sidebar__footer-badge">
            {userInitial}
          </div>
          <div className="sidebar__footer-info">
            <span className="sidebar__footer-title">Paket Premium</span>
            <span className="sidebar__footer-status">Aktif s/d 2027</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
