import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { parseISODate, daysAgoISO, todayISO } from '../utils/formatDate';
import { DEFAULT_WALLETS } from '../utils/wallets';

// ===== INITIAL SAMPLE DATA =====
const SAMPLE_TRANSACTIONS = [
  { id: '1', type: 'income', category: 'salary', amount: 8000000, date: '2026-08-01', note: 'Gaji bulan Agustus', wallet: 'bca' },
  { id: '2', type: 'expense', category: 'food', amount: 85000, date: '2026-08-02', note: 'Makan siang', wallet: 'cash' },
  { id: '3', type: 'expense', category: 'transport', amount: 50000, date: '2026-08-03', note: 'Bensin motor', wallet: 'cash' },
  { id: '4', type: 'income', category: 'freelance', amount: 1500000, date: '2026-08-04', note: 'Project desain logo', wallet: 'bca' },
  { id: '5', type: 'expense', category: 'bills', amount: 350000, date: '2026-08-05', note: 'Listrik & Internet', wallet: 'bca' },
  { id: '6', type: 'expense', category: 'shopping', amount: 450000, date: '2026-08-06', note: 'Belanja bulanan', wallet: 'gopay' },
  { id: '7', type: 'expense', category: 'entertainment', amount: 120000, date: '2026-08-07', note: 'Netflix', wallet: 'gopay' },
  { id: '8', type: 'income', category: 'investment', amount: 250000, date: '2026-07-28', note: 'Dividen reksa dana', wallet: 'bca' },
  { id: '9', type: 'expense', category: 'health', amount: 180000, date: '2026-07-25', note: 'Vitamin & obat', wallet: 'cash' },
  { id: '10', type: 'expense', category: 'food', amount: 65000, date: '2026-07-20', note: 'Kopi & snack', wallet: 'gopay' },
  { id: '11', type: 'income', category: 'salary', amount: 8000000, date: '2026-07-01', note: 'Gaji bulan Juli', wallet: 'bca' },
  { id: '12', type: 'expense', category: 'education', amount: 299000, date: '2026-07-15', note: 'Kursus online Udemy', wallet: 'bca' },
  { id: '13', type: 'income', category: 'freelance', amount: 2000000, date: '2026-06-20', note: 'Pembuatan website', wallet: 'bca' },
  { id: '14', type: 'income', category: 'salary', amount: 8000000, date: '2026-06-01', note: 'Gaji bulan Juni', wallet: 'bca' },
  { id: '15', type: 'expense', category: 'shopping', amount: 750000, date: '2026-06-10', note: 'Baju baru', wallet: 'cash' },
];

const DEFAULT_PROFILE = {
  name: 'Renno',
  currency: 'IDR',
};

// ===== CONTEXT =====
const TransactionContext = createContext(null);

// ===== REDUCER =====
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'RESET_TRANSACTIONS':
      return {
        ...state,
        transactions: SAMPLE_TRANSACTIONS,
        wallets: DEFAULT_WALLETS,
      };

    case 'ADD_TRANSACTION': {
      const defaultWalletId = state.wallets[0]?.id || 'cash';
      const newTransaction = {
        ...action.payload,
        id: Date.now().toString(),
        wallet: action.payload.wallet || defaultWalletId,
      };
      return { ...state, transactions: [newTransaction, ...state.transactions] };
    }

    case 'UPDATE_TRANSACTION': {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    }

    case 'RESTORE_TRANSACTION': {
      const existing = state.transactions.find((t) => t.id === action.payload.id);
      if (existing) return state;
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    }

    // ===== WALLET ACTIONS =====
    case 'SET_WALLETS':
      return { ...state, wallets: action.payload };

    case 'ADD_WALLET': {
      const newWallet = {
        ...action.payload,
        id: action.payload.id || `wallet_${Date.now()}`,
        initialBalance: Number(action.payload.initialBalance || 0),
      };
      return { ...state, wallets: [...state.wallets, newWallet] };
    }

    case 'UPDATE_WALLET': {
      const updatedWallets = state.wallets.map((w) =>
        w.id === action.payload.id
          ? { ...w, ...action.payload, initialBalance: Number(action.payload.initialBalance || 0) }
          : w
      );
      return { ...state, wallets: updatedWallets };
    }

    case 'DELETE_WALLET': {
      const fallbackWalletId = state.wallets.find((w) => w.id !== action.payload)?.id || 'cash';
      // Reassign transactions from deleted wallet to fallback
      const remappedTransactions = state.transactions.map((t) =>
        t.wallet === action.payload ? { ...t, wallet: fallbackWalletId } : t
      );
      const filteredWallets = state.wallets.filter((w) => w.id !== action.payload);
      return {
        ...state,
        transactions: remappedTransactions,
        wallets: filteredWallets,
      };
    }

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } };

    case 'RESET_FILTER':
      return {
        ...state,
        filter: {
          ...initialState.filter,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        },
      };

    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };

    default:
      return state;
  }
};

// ===== INITIAL STATE =====
const initialState = {
  transactions: [],
  wallets: DEFAULT_WALLETS,
  profile: DEFAULT_PROFILE,
  filter: {
    mode: 'month',
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    startDate: daysAgoISO(30),
    endDate: todayISO(),
    category: 'all',
    type: 'all',
    wallet: 'all',
    search: '',
    sortBy: 'date-desc',
  },
};

// ===== PROVIDER =====
export const TransactionProvider = ({ children }) => {
  const [savedTransactions, setSavedTransactions] = useLocalStorage(
    'tanciku_transactions',
    SAMPLE_TRANSACTIONS
  );

  const [savedWallets, setSavedWallets] = useLocalStorage(
    'tanciku_wallets',
    DEFAULT_WALLETS
  );

  const [savedProfile, setSavedProfile] = useLocalStorage(
    'tanciku_profile',
    DEFAULT_PROFILE
  );

  const [state, dispatch] = useReducer(transactionReducer, {
    ...initialState,
    transactions: savedTransactions,
    wallets: savedWallets,
    profile: savedProfile,
  });

  // Sync to localStorage
  useEffect(() => {
    setSavedTransactions(state.transactions);
  }, [state.transactions, setSavedTransactions]);

  useEffect(() => {
    setSavedWallets(state.wallets);
  }, [state.wallets, setSavedWallets]);

  useEffect(() => {
    setSavedProfile(state.profile);
  }, [state.profile, setSavedProfile]);

  // Derived: filtered transactions based on active filter mode
  const filteredTransactions = state.transactions.filter((t) => {
    const date = parseISODate(t.date);
    const dateISO = t.date;

    let matchTime = true;
    if (state.filter.mode === 'month') {
      matchTime = date.getMonth() === state.filter.month && date.getFullYear() === state.filter.year;
    } else if (state.filter.mode === '7days') {
      const sevenDaysAgo = daysAgoISO(7);
      matchTime = dateISO >= sevenDaysAgo && dateISO <= todayISO();
    } else if (state.filter.mode === '30days') {
      const thirtyDaysAgo = daysAgoISO(30);
      matchTime = dateISO >= thirtyDaysAgo && dateISO <= todayISO();
    } else if (state.filter.mode === 'year') {
      matchTime = date.getFullYear() === state.filter.year;
    } else if (state.filter.mode === 'custom') {
      const start = state.filter.startDate || '1970-01-01';
      const end = state.filter.endDate || '2099-12-31';
      matchTime = dateISO >= start && dateISO <= end;
    } else if (state.filter.mode === 'all') {
      matchTime = true;
    }

    const defaultWalletId = state.wallets[0]?.id || 'cash';
    const matchCategory =
      state.filter.category === 'all' || t.category === state.filter.category;
    const matchType =
      state.filter.type === 'all' || t.type === state.filter.type;
    const matchWallet =
      state.filter.wallet === 'all' || (t.wallet || defaultWalletId) === state.filter.wallet;
    const matchSearch =
      !state.filter.search ||
      t.note?.toLowerCase().includes(state.filter.search.toLowerCase()) ||
      t.category.toLowerCase().includes(state.filter.search.toLowerCase());

    return matchTime && matchCategory && matchType && matchWallet && matchSearch;
  });

  // Derived: sorted transactions
  const sortedFilteredTransactions = [...filteredTransactions].sort((a, b) => {
    const sortBy = state.filter.sortBy || 'date-desc';
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return new Date(b.date) - new Date(a.date);
  });

  // Derived: summary for filtered transactions
  const summary = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );

  // Derived: balance per wallet (Initial Balance + Inflows - Outflows)
  const walletBalances = state.wallets.reduce((acc, w) => {
    const initial = Number(w.initialBalance || 0);
    const walletTransactions = state.transactions.filter((t) => (t.wallet || 'cash') === w.id);
    const totalIn = walletTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalOut = walletTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    acc[w.id] = initial + totalIn - totalOut;
    return acc;
  }, {});

  // Derived: all-time total balance across all wallets
  const totalBalance = Object.values(walletBalances).reduce((sum, bal) => sum + bal, 0);

  const value = {
    transactions: state.transactions,
    wallets: state.wallets,
    filteredTransactions: sortedFilteredTransactions,
    rawFilteredTransactions: filteredTransactions,
    filter: state.filter,
    profile: state.profile,
    summary,
    totalBalance,
    walletBalances,
    dispatch,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// ===== HOOK =====
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};
