/**
 * Format number as Lao Kip currency
 * @param amount - The amount to format
 * @returns Formatted string with LAK symbol
 */
export function formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

    // Format with thousand separators and no decimals (Kip doesn't use decimals)
    return new Intl.NumberFormat('lo-LA', {
        style: 'currency',
        currency: 'LAK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount)
}

/**
 * Format number as plain LAK without currency symbol
 * @param amount - The amount to format
 * @returns Formatted string with thousand separators
 */
export function formatAmount(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('lo-LA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount)
}
