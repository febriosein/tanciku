import React from 'react';
import { Receipt } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ title = 'Belum ada transaksi', description = 'Tambahkan transaksi pertamamu!', icon: Icon = Receipt }) => {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state__icon">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__desc">{description}</p>
    </div>
  );
};

export default EmptyState;
