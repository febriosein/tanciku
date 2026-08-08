import React, { useState, useEffect, useRef } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORIES } from '../../utils/categories';
import { todayISO } from '../../utils/formatDate';
import Modal from '../ui/Modal';
import './TransactionModal.css';

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 500000];

const NOTE_SUGGESTIONS = {
  food: ['Makan Siang', 'Kopi & Snack', 'Makan Malam', 'Belanja Dapur'],
  transport: ['Bensin', 'Gojek / Grab', 'Parkir', 'Tol'],
  shopping: ['Belanja Bulanan', 'Baju & Toko', 'Keperluan Rumah'],
  bills: ['Listrik & Air', 'Pulsa & Data', 'Internet WiFi', 'Sewa / Kos'],
  health: ['Obat & Vitamin', 'Dokter', 'Skincare'],
  entertainment: ['Streaming', 'Bioskop', 'Game', 'Jalan-jalan'],
  salary: ['Gaji Bulanan', 'Bonus', 'THR'],
  freelance: ['Project Client', 'Desain / Code', 'Sampingan'],
  investment: ['Dividen', 'Reksa Dana', 'Saham / Kripto'],
  gift: ['Transfer Masuk', 'Hadiah', 'Angpao'],
  education: ['Buku', 'Kursus Online', 'SPP'],
  other_expense: ['Belanja Lain', 'Keperluan Mendadak'],
  other_income: ['Pendapatan Lain'],
};

const INITIAL_FORM = {
  type: 'expense',
  amount: '',
  category: 'food',
  date: todayISO(),
  note: '',
};

const getYesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDisplayAmount = (val) => {
  if (!val) return '';
  return Number(val).toLocaleString('id-ID');
};

/* =============================================
   MOBILE FULL-SCREEN COMPONENT
   ============================================= */
const MobileAddTransaction = ({ isOpen, onClose, transaction, onSubmit }) => {
  const isEditing = !!transaction;
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const amountInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (transaction) {
      setForm({ ...transaction, amount: String(transaction.amount) });
    } else {
      setForm({ ...INITIAL_FORM, date: todayISO() });
    }
    setError('');
    // Focus amount input after open animation
    setTimeout(() => amountInputRef.current?.focus(), 200);
  }, [transaction, isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleTypeChange = (type) => {
    const defaultCat = type === 'income' ? 'salary' : 'food';
    setForm((f) => ({ ...f, type, category: defaultCat }));
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setForm((f) => ({ ...f, amount: raw }));
    if (error) setError('');
  };

  const handleAddQuickAmount = (val) => {
    const current = Number(form.amount || 0);
    setForm((f) => ({ ...f, amount: String(current + val) }));
    if (error) setError('');
  };

  const handleSubmit = () => {
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Masukkan nominal terlebih dahulu');
      amountInputRef.current?.focus();
      return;
    }
    onSubmit({ ...form, amount: Number(form.amount) });
    onClose();
  };

  const categories = CATEGORIES[form.type] || [];
  const suggestions = NOTE_SUGGESTIONS[form.category] || [];
  const todayStr = todayISO();
  const yesterdayStr = getYesterdayISO();

  if (!isOpen) return null;

  return (
    <div className="ms-overlay">
      {/* ── Header ── */}
      <div className={`ms-header ms-header--${form.type}`}>
        <button className="ms-close-btn" onClick={onClose} aria-label="Tutup">
          <span className="material-symbols-outlined">close</span>
        </button>
        <span className="ms-header-title">
          {isEditing ? 'Edit Transaksi' : 'Transaksi Baru'}
        </span>
        <div className="ms-header-spacer" />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="ms-body">

        {/* Type Toggle */}
        <div className="ms-type-toggle">
          <button
            className={`ms-type-btn ${form.type === 'expense' ? 'ms-type-btn--active-expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>trending_down</span>
            Pengeluaran
          </button>
          <button
            className={`ms-type-btn ${form.type === 'income' ? 'ms-type-btn--active-income' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>trending_up</span>
            Pemasukan
          </button>
        </div>

        {/* Amount Hero */}
        <div className={`ms-amount-box ms-amount-box--${form.type} ${error ? 'ms-amount-box--error' : ''}`}>
          <p className="ms-amount-label">NOMINAL</p>
          <div className="ms-amount-row">
            <span className="ms-amount-rp">Rp</span>
            <input
              ref={amountInputRef}
              id="ms-amount-input"
              type="text"
              inputMode="numeric"
              className="ms-amount-input"
              placeholder="0"
              value={formatDisplayAmount(form.amount)}
              onChange={handleAmountChange}
            />
            {form.amount && (
              <button
                className="ms-amount-clear"
                onClick={() => setForm((f) => ({ ...f, amount: '' }))}
                aria-label="Hapus"
              >
                <span className="material-symbols-outlined" style={{fontSize:'16px'}}>backspace</span>
              </button>
            )}
          </div>
          {error && <p className="ms-error">{error}</p>}
          {/* Quick Amount Chips */}
          <div className="ms-quick-chips">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                className="ms-quick-chip"
                onClick={() => handleAddQuickAmount(val)}
              >
                +{val >= 1000 ? `${val / 1000}rb` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="ms-section">
          <p className="ms-section-label">KATEGORI</p>
          <div className="ms-cat-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`ms-cat-btn ${form.category === cat.id ? 'ms-cat-btn--active' : ''}`}
                style={{ '--c': cat.color }}
                onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
              >
                <span className="ms-cat-icon">{cat.icon}</span>
                <span className="ms-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="ms-section">
          <p className="ms-section-label">TANGGAL</p>
          <div className="ms-date-row">
            <button
              className={`ms-date-chip ${form.date === todayStr ? 'ms-date-chip--active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, date: todayStr }))}
            >Hari Ini</button>
            <button
              className={`ms-date-chip ${form.date === yesterdayStr ? 'ms-date-chip--active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, date: yesterdayStr }))}
            >Kemarin</button>
            <input
              type="date"
              className="ms-date-input"
              value={form.date}
              max={todayStr}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
        </div>

        {/* Note */}
        <div className="ms-section">
          <p className="ms-section-label">CATATAN <span className="ms-optional">(opsional)</span></p>
          <input
            type="text"
            className="ms-note-input"
            placeholder="Tambah catatan..."
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            maxLength={80}
          />
          {suggestions.length > 0 && (
            <div className="ms-suggestions">
              {suggestions.map((s) => (
                <button key={s} className="ms-suggestion-chip" onClick={() => setForm((f) => ({ ...f, note: s }))}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom padding so content clears the FAB */}
        <div style={{ height: '100px' }} />
      </div>

      {/* ── Sticky Submit ── */}
      <div className="ms-footer">
        <button
          className={`ms-submit-btn ms-submit-btn--${form.type}`}
          onClick={handleSubmit}
        >
          <span className="material-symbols-outlined" style={{fontSize:'20px'}}>
            {isEditing ? 'save' : 'add_circle'}
          </span>
          <span>
            {isEditing
              ? 'Simpan Perubahan'
              : form.type === 'income' ? 'Simpan Pemasukan' : 'Simpan Pengeluaran'}
          </span>
          {form.amount && (
            <span className="ms-submit-amount">• Rp {formatDisplayAmount(form.amount)}</span>
          )}
        </button>
      </div>
    </div>
  );
};

/* =============================================
   MAIN EXPORT — auto-switches mobile vs desktop
   ============================================= */
const TransactionModal = ({ isOpen, onClose, transaction = null }) => {
  const { dispatch } = useTransactions();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleSubmit = (payload) => {
    if (transaction) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload });
    }
  };

  // ── MOBILE: full-screen overlay ──
  if (isMobile) {
    return (
      <MobileAddTransaction
        isOpen={isOpen}
        onClose={onClose}
        transaction={transaction}
        onSubmit={handleSubmit}
      />
    );
  }

  // ── DESKTOP: elegant modal ──
  return (
    <DesktopTransactionModal
      isOpen={isOpen}
      onClose={onClose}
      transaction={transaction}
      onSubmit={handleSubmit}
    />
  );
};

/* =============================================
   DESKTOP MODAL COMPONENT
   ============================================= */
const DesktopTransactionModal = ({ isOpen, onClose, transaction, onSubmit }) => {
  const isEditing = !!transaction;
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setForm({ ...transaction, amount: String(transaction.amount) });
    } else {
      setForm({ ...INITIAL_FORM, date: todayISO() });
    }
    setError('');
  }, [transaction, isOpen]);

  const handleTypeChange = (type) => {
    const defaultCat = type === 'income' ? 'salary' : 'food';
    setForm((f) => ({ ...f, type, category: defaultCat }));
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setForm((f) => ({ ...f, amount: raw }));
    if (error) setError('');
  };

  const handleAddQuickAmount = (val) => {
    const current = Number(form.amount || 0);
    setForm((f) => ({ ...f, amount: String(current + val) }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Masukkan jumlah yang valid');
      return;
    }
    onSubmit({ ...form, amount: Number(form.amount) });
    onClose();
  };

  const categories = CATEGORIES[form.type] || [];
  const suggestions = NOTE_SUGGESTIONS[form.category] || [];
  const todayStr = todayISO();
  const yesterdayStr = getYesterdayISO();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Transaksi' : 'Tambah Transaksi'}>
      <form onSubmit={handleSubmit} className="quick-form">
        {/* Type Toggle */}
        <div className="quick-type-toggle">
          <button type="button"
            className={`quick-type-btn quick-type-btn--expense ${form.type === 'expense' ? 'active' : ''}`}
            onClick={() => handleTypeChange('expense')}>
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>trending_down</span>
            <span>Pengeluaran</span>
          </button>
          <button type="button"
            className={`quick-type-btn quick-type-btn--income ${form.type === 'income' ? 'active' : ''}`}
            onClick={() => handleTypeChange('income')}>
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>trending_up</span>
            <span>Pemasukan</span>
          </button>
        </div>

        {/* Amount */}
        <div className={`quick-amount-hero ${error ? 'has-error' : ''}`}>
          <div className="quick-amount-label">NOMINAL TRANSAKSI</div>
          <div className="quick-amount-input-row">
            <span className="quick-amount-currency">Rp</span>
            <input id="amount" type="text" inputMode="numeric"
              className="quick-amount-input" placeholder="0"
              value={formatDisplayAmount(form.amount)}
              onChange={handleAmountChange} autoFocus />
            {form.amount && (
              <button type="button" className="quick-amount-clear"
                onClick={() => setForm((f) => ({ ...f, amount: '' }))}>
                <span className="material-symbols-outlined" style={{fontSize:'14px'}}>close</span>
              </button>
            )}
          </div>
          <div className="quick-amount-chips">
            {QUICK_AMOUNTS.map((val) => (
              <button key={val} type="button" className="amount-chip"
                onClick={() => handleAddQuickAmount(val)}>
                +{val >= 1000 ? `${val / 1000}rb` : val}
              </button>
            ))}
          </div>
          {error && <p className="quick-error">{error}</p>}
        </div>

        {/* Category */}
        <div className="quick-section">
          <label className="quick-section-title">KATEGORI</label>
          <div className="quick-category-grid">
            {categories.map((cat) => (
              <button key={cat.id} type="button"
                className={`quick-cat-btn ${form.category === cat.id ? 'active' : ''}`}
                style={{ '--cat-color': cat.color }}
                onClick={() => setForm((f) => ({ ...f, category: cat.id }))}>
                <span className="quick-cat-icon">{cat.icon}</span>
                <span className="quick-cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="quick-section">
          <label className="quick-section-title">TANGGAL</label>
          <div className="quick-date-row">
            <button type="button" className={`date-chip ${form.date === todayStr ? 'active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, date: todayStr }))}>Hari Ini</button>
            <button type="button" className={`date-chip ${form.date === yesterdayStr ? 'active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, date: yesterdayStr }))}>Kemarin</button>
            <input type="date" className="date-input-custom" value={form.date} max={todayStr}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
        </div>

        {/* Note */}
        <div className="quick-section">
          <label className="quick-section-title">CATATAN (OPSIONAL)</label>
          <input type="text" className="quick-note-input" placeholder="Ketik catatan..."
            value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            maxLength={100} />
          {suggestions.length > 0 && (
            <div className="note-suggestions">
              {suggestions.map((sug) => (
                <button key={sug} type="button" className="note-chip"
                  onClick={() => setForm((f) => ({ ...f, note: sug }))}>
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="quick-form-footer">
          <button type="submit"
            className={`quick-submit-btn ${form.type === 'income' ? 'quick-submit-btn--income' : 'quick-submit-btn--expense'}`}>
            <span>{isEditing ? 'Simpan Perubahan' : form.type === 'income' ? 'Simpan Pemasukan' : 'Simpan Pengeluaran'}</span>
            {form.amount && <span>• Rp {formatDisplayAmount(form.amount)}</span>}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionModal;
