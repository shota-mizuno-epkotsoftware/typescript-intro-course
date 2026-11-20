export function countIf(values: number[], condition: (n: number) => boolean): number {
  let count = 0;
  for (const value of values) {
    if (condition(value)) {
      count = count + 1;
    }
  }
  return count;
}

export function makeMultiplier(factor: number): (n: number) => number {
  return (n) => n * factor;
}
