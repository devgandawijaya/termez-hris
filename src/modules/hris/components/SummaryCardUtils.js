export function createBadge(label, value, type = 'default') {
  const colorMap = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
    default: 'default',
  };

  return { label, value, color: colorMap[type] || 'default' };
}