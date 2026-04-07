// Uganda Shillings currency formatter
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0
  }).format(amount);
};

// Short format for display (e.g., "500K" instead of "500,000 UGX")
export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1000000) {
    return `UGX ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `UGX ${(amount / 1000).toFixed(0)}K`;
  }
  return `UGX ${amount}`;
};

// Parse currency input (remove any non-numeric characters)
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
};
