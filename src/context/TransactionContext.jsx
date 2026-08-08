import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { parseISODate } from '../utils/formatDate';

// ===== INITIAL SAMPLE DATA =====
const SAMPLE_TRANSACTIONS = [
  { id: '1', type: 'income', category: 'salary', amount: 8000000, date: '2026-08-01', note: 'Gaji bulan Agustus' },
  { id: '2', type: 'expense', category: 'food', amount: 85000, date: '2026-08-02', note: 'Makan siang' },
  { id: '3', type: 'expense', category: 'transport', amount: 50000, date: '2026-08-03', note: 'Bensin motor' },
  { id: '4', type: 'income', category: 'freelance', amount: 1500000, date: '2026-08-04', note: 'Project desain logo' },
  { id: '5', type: 'expense', category: 'bills', amount: 350000, date: '2026-08-05', note: 'Listrik & Internet' },
  { id: '6', type: 'expense', category: 'shopping', amount: 450000, date: '2026-08-06', note: 'Belanja bulanan' },
  { id: '7', type: 'expense', category: 'entertainment', amount: 120000, date: '2026-08-07', note: 'Netflix' },
  { id: '8', type: 'income', category: 'investment', amount: 250000, date: '2026-07-28', note: 'Dividen reksa dana' },
  { id: '9', type: 'expense', category: 'health', amount: 180000, date: '2026-07-25', note: 'Vitamin & obat' },
  { id: '10', type: 'expense', category: 'food', amount: 65000, date: '2026-07-20', note: 'Kopi & snack' },
  { id: '11', type: 'income', category: 'salary', amount: 8000000, date: '2026-07-01', note: 'Gaji bulan Juli' },
  { id: '12', type: 'expense', category: 'education', amount: 299000, date: '2026-07-15', note: 'Kursus online Udemy' },
  { id: '13', type: 'income', category: 'freelance', amount: 2000000, date: '2026-06-20', note: 'Pembuatan website' },
  { id: '14', type: 'income', category: 'salary', amount: 8000000, date: '2026-06-01', note: 'Gaji bulan Juni' },
  { id: '15', type: 'expense', category: 'shopping', amount: 750000, date: '2026-06-10', note: 'Baju baru' },
];

// ===== CONTEXT =====
const TransactionContext = createContext(null);

// ===== REDUCER =====
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'RESET_TRANSACTIONS':
      return { ...state, transactions: SAMPLE_TRANSACTIONS };

    case 'ADD_TRANSACTION': {
      const newTransaction = {
        ...action.payload,
        id: Date.now().toString(),
      };
      return { ...state, transactions: [newTransaction, ...state.transactions] };
    }

    case 'UPDATE_TRANSACTION': {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    }

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } };

    default:
      return state;
  }
};

// ===== INITIAL STATE =====
const initialState = {
  transactions: [],
  filter: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    category: 'all',
    type: 'all',
    search: '',
  },
};

// ===== PROVIDER =====
export const TransactionProvider = ({ children }) => {
  const [savedTransactions, setSavedTransactions] = useLocalStorage(
    'tanciku_transactions',
    SAMPLE_TRANSACTIONS
  );

  const [state, dispatch] = useReducer(transactionReducer, {
    ...initialState,
    transactions: savedTransactions,
  });

  // Sync to localStorage whenever transactions change
  useEffect(() => {
    setSavedTransactions(state.transactions);
  }, [state.transactions]);

  // Derived: filtered transactions
  const filteredTransactions = state.transactions.filter((t) => {
    const date = parseISODate(t.date);
    const matchMonth = date.getMonth() === state.filter.month;
    const matchYear = date.getFullYear() === state.filter.year;
    const matchCategory =
      state.filter.category === 'all' || t.category === state.filter.category;
    const matchType =
      state.filter.type === 'all' || t.type === state.filter.type;
    const matchSearch =
      !state.filter.search ||
      t.note?.toLowerCase().includes(state.filter.search.toLowerCase()) ||
      t.category.toLowerCase().includes(state.filter.search.toLowerCase());

    return matchMonth && matchYear && matchCategory && matchType && matchSearch;
  });

  // Derived: summary for filtered month
  const summary = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );

  // Derived: all-time balance
  const totalBalance = state.transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  const value = {
    transactions: state.transactions,
    filteredTransactions,
    filter: state.filter,
    summary,
    totalBalance,
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
