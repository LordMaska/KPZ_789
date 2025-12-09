/**
 * Cost type - can be number, string, or object with amount/value
 */
export type Cost = number | string | {
  amount?: number;
  value?: number;
  currency?: string;
};

/**
 * Parse cost from various formats to number
 * @param cost - Cost in various formats
 * @returns Numeric cost value
 */
export function parseCost(cost: Cost): number {
  if (typeof cost === 'number') {
    return cost;
  }
  
  if (typeof cost === 'string') {
    // Remove all non-numeric characters except dot and minus
    const cleaned = cost.replace(/[^\d.-]/g, '');
    return Number(cleaned) || 0;
  }
  
  if (typeof cost === 'object' && cost !== null) {
    if (typeof cost.amount === 'number') return cost.amount;
    if (typeof cost.value === 'number') return cost.value;
  }
  
  return 0;
}

/**
 * Format cost as currency string
 * @param cost - Cost in various formats
 * @param currency - Currency symbol (default: '₴')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "125.50 ₴")
 */
export function formatCurrency(
  cost: Cost,
  currency: string = '₴',
  decimals: number = 2
): string {
  const numericCost = parseCost(cost);
  return `${numericCost.toFixed(decimals)} ${currency}`;
}

/**
 * Format cost for display without currency symbol
 * @param cost - Cost in various formats
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatCostNumber(cost: Cost, decimals: number = 2): string {
  const numericCost = parseCost(cost);
  return numericCost.toFixed(decimals);
}
