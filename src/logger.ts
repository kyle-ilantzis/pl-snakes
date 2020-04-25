const level = 1;

const debugLevel = 1;
const verboseLevel = 0;

export function debug(...args: any[]) {
  if (debugLevel < level) {
    return;
  }
  console.log(...args);
}

export function verbose(...args: any[]) {
  if (verboseLevel < level) {
    return;
  }
  console.log(...args);
}