export const formatCurrency = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export const formatDate = (value, options = {}) => {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  });
};

export const formatDateTime = (value) => {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};