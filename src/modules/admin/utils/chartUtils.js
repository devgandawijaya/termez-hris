// Utility functions for chart components
export function getColorScale(value, min, max) {
  const ratio = (value - min) / (max - min);
  if (ratio < 0.33) return '#ADD8E6'; // light blue
  if (ratio < 0.66) return '#FFFF66'; // yellow
  return '#FF6666'; // red
}

export function formatNumber(num) {
  return num.toLocaleString();
}
