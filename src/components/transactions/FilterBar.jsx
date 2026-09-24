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
    <section className="filter-bar-suite" data-purpose="filter-bar">
      {/* Search Input */}
      <div className="filter-bar-suite__search-box">
        <span className="filter-bar-suite__search-icon">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <input
          type="text"
          className="filter-bar-suite__search-input"
          placeholder="Cari catatan, kategori transaksi..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          id="input-search"
        />
        {filter.search && (
          <button
            type="button"
            className="filter-bar-suite__clear-btn"
            onClick={() => setFilter({ search: '' })}
            aria-label="Hapus pencarian"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Filter Selects Row */}
      <div className="filter-bar-suite__selects-group">
        {/* Time Mode Select */}
        <select
          className="filter-custom-select"
          value={filter.mode || 'month'}
          onChange={handleModeChange}
          id="select-filter-mode"
          aria-label="Pilih Mode Waktu"
        >
          <option value="month">Pilih Bulan</option>
          <option value="7days">7 Hari Terakhir</option>
          <option value="30days">30 Hari Terakhir</option>
          <option value="year">Tahun Ini</option>
          <option value="custom">Rentang Kustom</option>
          <option value="all">Semua Waktu</option>
        </select>

        {/* If 'month' mode, show Month & Year dropdowns */}
        {(filter.mode === 'month' || !filter.mode) && (
          <>
            <select
              className="filter-custom-select font-semibold"
              value={filter.month}
              onChange={(e) => setFilter({ month: Number(e.target.value) })}
              id="select-month"
              aria-label="Bulan"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <select
              className="filter-custom-select font-semibold"
              value={filter.year}
              onChange={(e) => setFilter({ year: Number(e.target.value) })}
              id="select-year"
              aria-label="Tahun"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </>
        )}

        {/* If 'custom' mode, show start and end date pickers */}
        {filter.mode === 'custom' && (
          <div className="filter-bar-suite__dates-pill">
            <input
              type="date"
              className="filter-bar-suite__date-field"
              value={filter.startDate || ''}
              onChange={(e) => setFilter({ startDate: e.target.value })}
              max={filter.endDate || todayISO()}
              title="Tanggal Mulai"
            />
            <span className="filter-bar-suite__date-dash">-</span>
            <input
              type="date"
              className="filter-bar-suite__date-field"
              value={filter.endDate || ''}
              onChange={(e) => setFilter({ endDate: e.target.value })}
              min={filter.startDate || ''}
              max={todayISO()}
              title="Tanggal Akhir"
            />
          </div>
        )}

        {/* Wallet Filter */}
        {showWalletFilter && (
          <select
            className="filter-custom-select"
            value={filter.wallet || 'all'}
            onChange={(e) => setFilter({ wallet: e.target.value })}
            id="select-wallet"
            aria-label="Dompet"
          >
            <option value="all">Semua Dompet</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        )}

        {/* Category Filter */}
        <select
          className="filter-custom-select"
          value={filter.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          id="select-category"
          aria-label="Kategori"
        >
          <option value="all">Semua Kategori</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        {/* Type Filter */}
        {showTypeFilter && (
          <select
            className="filter-custom-select"
            value={filter.type}
            onChange={(e) => setFilter({ type: e.target.value })}
            id="select-type"
            aria-label="Jenis"
          >
            <option value="all">Semua Jenis</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        )}

        {/* Nominal Range Filter */}
        <select
          className="filter-custom-select"
          value={activeAmountPreset}
          onChange={handleAmountPresetChange}
          id="select-amount-range"
          aria-label="Nominal"
        >
          <option value="all">Semua Nominal</option>
          <option value="under50k">&lt; Rp 50.000</option>
          <option value="50k-500k">Rp 50rb - 500rb</option>
          <option value="above500k">&gt; Rp 500.000</option>
          <option value="custom">Nominal Kustom...</option>
        </select>

        {/* Custom Min & Max Inputs */}
        {(showCustomAmount || (activeAmountPreset === 'custom' && (filter.minAmount || filter.maxAmount))) && (
          <div className="filter-bar-suite__custom-amount">
            <input
              type="number"
              inputMode="numeric"
              className="filter-bar-suite__num-input"
              placeholder="Min"
              value={filter.minAmount || ''}
              onChange={(e) => setFilter({ minAmount: e.target.value })}
            />
            <span className="filter-bar-suite__date-dash">-</span>
            <input
              type="number"
              inputMode="numeric"
              className="filter-bar-suite__num-input"
              placeholder="Max"
              value={filter.maxAmount || ''}
              onChange={(e) => setFilter({ maxAmount: e.target.value })}
            />
            <button
              type="button"
              className="filter-bar-suite__close-amount"
              onClick={() => {
                setShowCustomAmount(false);
                setFilter({ minAmount: '', maxAmount: '' });
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterBar;
