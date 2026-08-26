export const DEFAULT_WALLETS = [
  { id: 'cash', label: 'Tunai (Cash)', icon: 'payments', color: '#10b981', initialBalance: 0, isDefault: true },
  { id: 'bca', label: 'Bank BCA', icon: 'account_balance', color: '#00529C', initialBalance: 0 },
  { id: 'mandiri', label: 'Bank Mandiri', icon: 'account_balance', color: '#003D79', initialBalance: 0 },
  { id: 'gopay', label: 'GoPay', icon: 'account_balance_wallet', color: '#00AED6', initialBalance: 0 },
  { id: 'ovo', label: 'OVO', icon: 'account_balance_wallet', color: '#4C3494', initialBalance: 0 },
  { id: 'dana', label: 'DANA', icon: 'account_balance_wallet', color: '#118EEA', initialBalance: 0 },
  { id: 'shopeepay', label: 'ShopeePay', icon: 'shopping_bag', color: '#EE4D2D', initialBalance: 0 },
  { id: 'other_wallet', label: 'Lainnya', icon: 'credit_card', color: '#64748B', initialBalance: 0 },
];

export const WALLET_ICONS = [
  { id: 'payments', label: 'Tunai' },
  { id: 'account_balance', label: 'Bank' },
  { id: 'account_balance_wallet', label: 'E-Wallet' },
  { id: 'savings', label: 'Tabungan' },
  { id: 'credit_card', label: 'Kartu' },
  { id: 'shopping_bag', label: 'Belanja' },
  { id: 'currency_exchange', label: 'Valas' },
  { id: 'trending_up', label: 'Investasi' },
  { id: 'store', label: 'Bisnis' },
  { id: 'monetization_on', label: 'Koin' },
];

export const WALLET_COLORS = [
  '#10b981', // Emerald Green
  '#00529C', // BCA Blue
  '#003D79', // Mandiri Dark Blue
  '#00AED6', // GoPay Cyan
  '#4C3494', // OVO Purple
  '#118EEA', // DANA Blue
  '#EE4D2D', // Shopee Orange-Red
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#64748B', // Slate
];

export const getWalletById = (id, customWallets = null) => {
  const list = customWallets || DEFAULT_WALLETS;
  return list.find((w) => w.id === id) || {
    id: 'other',
    label: 'Lainnya',
    icon: 'credit_card',
    color: '#64748B',
    initialBalance: 0,
  };
};
