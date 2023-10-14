
export function formatNumber(amount: number, precision?: number) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: precision }).format(amount);
}