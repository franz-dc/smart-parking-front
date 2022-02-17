export const formatCurrency = (
  amount: number = 0,
  numberFormatOptions: Intl.NumberFormatOptions = { currency: 'PHP' }
) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    ...numberFormatOptions,
  }).format(amount);
