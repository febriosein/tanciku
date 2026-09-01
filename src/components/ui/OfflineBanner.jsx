import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import './OfflineBanner.css';

const OfflineBanner = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <div className="offline-banner-container animate-slide-down">
      {!isOnline ? (
        <div className="offline-pill offline-pill--offline">
          <WifiOff size={14} className="offline-icon" />
          <span>Mode Offline — Catatan keuangan tetap tersimpan aman di HP</span>
        </div>
      ) : (
        <div className="offline-pill offline-pill--online animate-fade-in">
          <Wifi size={14} className="offline-icon" />
          <span>Kembali Online — Aplikasi siap digunakan</span>
        </div>
      )}
    </div>
  );
};

export default OfflineBanner;
