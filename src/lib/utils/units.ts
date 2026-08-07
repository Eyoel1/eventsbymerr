export const KG_TO_LB = 2.20462;

export function kgToLb(kg: number): number {
  return Math.round(kg * KG_TO_LB * 4) / 4; // round to nearest 0.25
}

export function lbToKg(lb: number): number {
  return Math.round((lb / KG_TO_LB) * 4) / 4;
}

export function displayWeight(kg: number, unit: 'kg' | 'lb'): string {
  if (unit === 'lb') {
    return `${kgToLb(kg)} lb`;
  }
  return `${kg} kg`;
}

export function displayWeightVal(kg: number, unit: 'kg' | 'lb'): number {
  return unit === 'lb' ? kgToLb(kg) : kg;
}

export function inputToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'lb' ? lbToKg(value) : value;
}
