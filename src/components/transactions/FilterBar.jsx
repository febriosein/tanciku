import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { ALL_CATEGORIES } from '../../utils/categories';
import './FilterBar.css';

const MONTHS = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const FilterBar = ({ showTypeFilter = true }) => {
  const { filter, dispatch } = useTransactions();

  const setFilter = (payload) => {
    dispatch({ type: 'SET_FILTER', payload });
  };

  return (
    <div className="filter-card">
      <div className="filter-card__search">
        <span className="material-symbols-outlined filter-card__search-icon">search</span>
        <input
          type="text"
          className="filter-card__input"
          placeholder="Cari transaksi..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          id="input-search"
        />
      </div>

      <div className="filter-card__divider" />

      <div className="filter-card__selects">
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
