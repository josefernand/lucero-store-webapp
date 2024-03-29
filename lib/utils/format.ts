export function formatCurrency(price?: number, symbol: boolean = true): string {
  if (!price) return '';
  return new Intl.NumberFormat('es-AR', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(price);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
