import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { ALL_CATEGORIES } from '../../utils/categories';
import { todayISO } from '../../utils/formatDate';
import './FilterBar.css';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const FilterBar = ({ showTypeFilter = true, showWalletFilter = true }) => {
  const { filter, wallets, dispatch } = useTransactions();
  const [showCustomAmount, setShowCustomAmount] = useState(false);

  const setFilter = (payload) => {
    dispatch({ type: 'SET_FILTER', payload });
  };

  const handleModeChange = (e) => {
    const mode = e.target.value;
    setFilter({ mode });
  };

  const handleAmountPresetChange = (e) => {
    const val = e.target.value;
    if (val === 'all') {
      setShowCustomAmount(false);
      setFilter({ minAmount: '', maxAmount: '' });
    } else if (val === 'under50k') {
      setShowCustomAmount(false);
      setFilter({ minAmount: '', maxAmount: 50000 });
    } else if (val === '50k-500k') {
      setShowCustomAmount(false);
      setFilter({ minAmount: 50000, maxAmount: 500000 });
    } else if (val === 'above500k') {
      setShowCustomAmount(false);
      setFilter({ minAmount: 500000, maxAmount: '' });
    } else if (val === 'custom') {
      setShowCustomAmount(true);
    }
  };

  let activeAmountPreset = 'all';
  if (showCustomAmount) {
    activeAmountPreset = 'custom';
  } else if (!filter.minAmount && filter.maxAmount === 50000) {
    activeAmountPreset = 'under50k';
  } else if (filter.minAmount === 50000 && filter.maxAmount === 500000) {
    activeAmountPreset = '50k-500k';
  } else if (filter.minAmount === 500000 && !filter.maxAmount) {
    activeAmountPreset = 'above500k';
  } else if (filter.minAmount || filter.maxAmount) {
    activeAmountPreset = 'custom';
  }

  return (
    <div className="filter-card">
      {/* Search Input */}
      <div className="filter-card__search">
        <span className="material-symbols-outlined filter-card__search-icon">search</span>
        <input
          type="text"
          className="filter-card__input"
          placeholder="Cari catatan, kategori transaksi..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          id="input-search"
        />
        {filter.search && (
          <button
            type="button"
            className="filter-card__clear-search"
            onClick={() => setFilter({ search: '' })}
            aria-label="Hapus pencarian"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <div className="filter-card__divider" />

      {/* Filter Selects Row */}
      <div className="filter-card__selects">
        {/* Time Mode Select */}
        <div className="filter-select-wrapper">
          <select
            className="filter-card__select"
            value={filter.mode || 'month'}
            onChange={handleModeChange}
            id="select-filter-mode"
            title="Filter Waktu"
          >
            <option value="month">Pilih Bulan</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
            <option value="year">Tahun Ini</option>
            <option value="custom">Rentang Kustom</option>
            <option value="all">Semua Waktu</option>
          </select>
        </div>

        {/* If 'month' mode, show Month & Year dropdowns */}
        {(filter.mode === 'month' || !filter.mode) && (
          <>
            <div className="filter-select-wrapper">
              <select
                className="filter-card__select"
                value={filter.month}
                onChange={(e) => setFilter({ month: Number(e.target.value) })}
                id="select-month"
                title="Bulan"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrapper">
              <select
                className="filter-card__select"
                value={filter.year}
                onChange={(e) => setFilter({ year: Number(e.target.value) })}
                id="select-year"
                title="Tahun"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* If 'custom' mode, show start and end date pickers */}
        {filter.mode === 'custom' && (
          <div className="filter-card__custom-dates">
            <input
              type="date"
              className="filter-card__date-input"
              value={filter.startDate || ''}
              onChange={(e) => setFilter({ startDate: e.target.value })}
              max={filter.endDate || todayISO()}
              title="Tanggal Mulai"
            />
            <span className="filter-card__date-sep">-</span>
            <input
              type="date"
              className="filter-card__date-input"
              value={filter.endDate || ''}
              onChange={(e) => setFilter({ endDate: e.target.value })}
              min={filter.startDate || ''}
              max={todayISO()}
              title="Tanggal Akhir"
            />
          </div>
        )}

        {/* Type Filter */}
        {showTypeFilter && (
          <div className="filter-select-wrapper">
            <select
              className="filter-card__select"
              value={filter.type}
              onChange={(e) => setFilter({ type: e.target.value })}
              id="select-type"
              title="Jenis Transaksi"
            >
              <option value="all">Semua Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
        )}

        {/* Wallet Filter */}
        {showWalletFilter && (
          <div className="filter-select-wrapper">
            <select
              className="filter-card__select"
              value={filter.wallet || 'all'}
              onChange={(e) => setFilter({ wallet: e.target.value })}
              id="select-wallet"
              title="Pilih Dompet"
            >
              <option value="all">Semua Dompet</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>{w.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filter */}
        <div className="filter-select-wrapper">
          <select
            className="filter-card__select"
            value={filter.category}
            onChange={(e) => setFilter({ category: e.target.value })}
            id="select-category"
            title="Kategori"
          >
            <option value="all">Semua Kategori</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Nominal Range Preset Filter */}
        <div className="filter-select-wrapper">
          <select
            className="filter-card__select"
            value={activeAmountPreset}
            onChange={handleAmountPresetChange}
            id="select-amount-range"
            title="Filter Nominal"
          >
            <option value="all">Semua Nominal</option>
            <option value="under50k">&lt; Rp 50.000 (Kecil)</option>
            <option value="50k-500k">Rp 50rb - 500rb</option>
            <option value="above500k">&gt; Rp 500.000 (Besar)</option>
            <option value="custom">Nominal Kustom...</option>
          </select>
        </div>

        {/* Custom Min & Max Inputs */}
        {(showCustomAmount || (activeAmountPreset === 'custom' && (filter.minAmount || filter.maxAmount))) && (
          <div className="filter-card__custom-amount">
            <input
              type="number"
              inputMode="numeric"
              className="filter-card__amount-input"
              placeholder="Min (Rp)"
              value={filter.minAmount || ''}
              onChange={(e) => setFilter({ minAmount: e.target.value })}
              title="Nominal Minimum"
            />
            <span className="filter-card__date-sep">-</span>
            <input
              type="number"
              inputMode="numeric"
              className="filter-card__amount-input"
              placeholder="Max (Rp)"
              value={filter.maxAmount || ''}
              onChange={(e) => setFilter({ maxAmount: e.target.value })}
              title="Nominal Maksimum"
            />
            <button
              type="button"
              className="filter-card__clear-amount"
              onClick={() => {
                setShowCustomAmount(false);
                setFilter({ minAmount: '', maxAmount: '' });
              }}
              title="Reset Filter Nominal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
