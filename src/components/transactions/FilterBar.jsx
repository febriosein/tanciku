import React from 'react';
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

  const setFilter = (payload) => {
    dispatch({ type: 'SET_FILTER', payload });
  };

  const handleModeChange = (e) => {
    const mode = e.target.value;
    setFilter({ mode });
  };

  return (
    <div className="filter-card">
      {/* Search Input */}
      <div className="filter-card__search">
        <span className="material-symbols-outlined filter-card__search-icon">search</span>
        <input
          type="text"
          className="filter-card__input"
          placeholder="Cari catatan, kategori..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          id="input-search"
        />
        {filter.search && (
          <button
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
        <select
          className="filter-card__select"
          value={filter.mode || 'month'}
          onChange={handleModeChange}
          id="select-filter-mode"
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
              className="filter-card__select"
              value={filter.month}
              onChange={(e) => setFilter({ month: Number(e.target.value) })}
              id="select-month"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>

            <select
              className="filter-card__select"
              value={filter.year}
              onChange={(e) => setFilter({ year: Number(e.target.value) })}
              id="select-year"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
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
          <select
            className="filter-card__select"
            value={filter.type}
            onChange={(e) => setFilter({ type: e.target.value })}
            id="select-type"
          >
            <option value="all">Semua Jenis</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        )}

        {/* Wallet Filter */}
        {showWalletFilter && (
          <select
            className="filter-card__select"
            value={filter.wallet || 'all'}
            onChange={(e) => setFilter({ wallet: e.target.value })}
            id="select-wallet"
          >
            <option value="all">Semua Dompet</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
        )}

        {/* Category Filter */}
        <select
          className="filter-card__select"
          value={filter.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          id="select-category"
        >
          <option value="all">Semua Kategori</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
