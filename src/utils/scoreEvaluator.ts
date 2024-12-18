export function evaluateScore(averageRating: number, visitors: number): number {
  return averageRating * (1 - Math.exp(-0.1 * visitors));
}
