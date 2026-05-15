export function formatEtherShort(wei: bigint, decimals = 5): string {
  if (wei === 0n) return '0';
  const eth = Number(wei) / 1e18;
  const min = 1 / 10 ** decimals;
  if (eth < min) return `<${min.toFixed(decimals)}`;
  return eth.toFixed(decimals).replace(/\.?0+$/, '') || '0';
}
