const Euro = Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
});

export const cF = (n) => {
  if (typeof n !== 'number') n = parseFloat(n);
  return Euro.format(n);
};

export const nF = (n) => {
  if (typeof n !== 'number') n = parseInt(n);
  n = Math.round(n);
  return n.toLocaleString('en-IE');
};

export const fF = (n) => {
  if (typeof n !== 'number') n = parseFloat(n);
  return n.toLocaleString('en-IE', { maximumFractionDigits: 2 });
};
