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

const DEFAULT_FILTER = {
  mode: 'month',
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  startDate: daysAgoISO(30),
  endDate: todayISO(),
  category: 'all',
  type: 'all',
  wallet: 'all',
  search: '',
  minAmount: '',
  maxAmount: '',
  sortBy: 'date-desc',
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

    case 'DELETE_MULTIPLE_TRANSACTIONS': {
      const idsToDelete = new Set(action.payload);
      return {
        ...state,
        transactions: state.transactions.filter((t) => !idsToDelete.has(t.id)),
      };
    }

    case 'CHANGE_MULTIPLE_WALLET': {
      const { ids, wallet } = action.payload;
      const targetIds = new Set(ids);
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          targetIds.has(t.id) ? { ...t, wallet } : t
        ),
      };
    }

    case 'CHANGE_MULTIPLE_CATEGORY': {
      const { ids, category } = action.payload;
      const targetIds = new Set(ids);
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          targetIds.has(t.id) ? { ...t, category } : t
        ),
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
          ...DEFAULT_FILTER,
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
  filter: DEFAULT_FILTER,
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

  const [savedFilter, setSavedFilter] = useLocalStorage(
    'tanciku_filter',
    DEFAULT_FILTER
  );

  const [state, dispatch] = useReducer(transactionReducer, {
    ...initialState,
    transactions: savedTransactions,
    wallets: savedWallets,
    profile: savedProfile,
    filter: { ...DEFAULT_FILTER, ...(savedFilter || {}) },
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

  useEffect(() => {
    setSavedFilter(state.filter);
  }, [state.filter, setSavedFilter]);

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
      matchTime = dateISO >= state.filter.startDate && dateISO <= state.filter.endDate;
    } else if (state.filter.mode === 'all') {
      matchTime = true;
    }

    const matchCategory =
      state.filter.category === 'all' || t.category === state.filter.category;

    const matchType =
      state.filter.type === 'all' || t.type === state.filter.type;

    const matchWallet =
      !state.filter.wallet || state.filter.wallet === 'all' || (t.wallet || 'cash') === state.filter.wallet;

    const matchSearch =
      !state.filter.search ||
      t.note.toLowerCase().includes(state.filter.search.toLowerCase()) ||
      t.category.toLowerCase().includes(state.filter.search.toLowerCase());

    const matchMinAmount =
      !state.filter.minAmount || t.amount >= Number(state.filter.minAmount);

    const matchMaxAmount =
      !state.filter.maxAmount || t.amount <= Number(state.filter.maxAmount);

    return matchTime && matchCategory && matchType && matchWallet && matchSearch && matchMinAmount && matchMaxAmount;
  });

  // Derived: sorted transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const sortBy = state.filter.sortBy || 'date-desc';
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    } else if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    // Default: date-desc
    return new Date(b.date) - new Date(a.date);
  });

  // Derived: summary calculations based on filtered transactions
  const income = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // Derived: wallet balances calculated dynamically from all transactions
  const walletsWithBalance = state.wallets.map((wallet) => {
    const walletTransactions = state.transactions.filter(
      (t) => (t.wallet || 'cash') === wallet.id
    );
    const wIncome = walletTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const wExpense = walletTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = (wallet.initialBalance || 0) + wIncome - wExpense;

    return {
      ...wallet,
      balance: currentBalance,
      income: wIncome,
      expense: wExpense,
      transactionCount: walletTransactions.length,
    };
  });

  // Derived: walletBalances dictionary
  const walletBalances = {};
  walletsWithBalance.forEach((w) => {
    walletBalances[w.id] = w.balance;
  });

  // Total balance combining all wallets
  const totalCombinedBalance = walletsWithBalance.reduce(
    (sum, w) => sum + (w.balance || 0),
    0
  );

  const value = {
    transactions: state.transactions,
    filteredTransactions: sortedTransactions,
    rawFilteredTransactions: filteredTransactions,
    wallets: walletsWithBalance,
    walletBalances,
    totalBalance: totalCombinedBalance,
    totalCombinedBalance,
    profile: state.profile,
    filter: state.filter,
    summary: { income, expense, balance },
    dispatch,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
