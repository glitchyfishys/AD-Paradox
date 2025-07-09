
export const absurdityUpgrades = {
  ADNerf: {
    id: "ADNerf",
    cost: 1,
    description: () => `Reduce the Antimatter Dimension nerf by ${formatAdd(0.01,0,2)}.`,
    effect: () => 1,
  },
  PDNerf: {
    id: "PDNerf",
    cost: 50,
    checkRequirement: () => AbsurdityUpgrade.ADNerf.isBought,
    description: () => `Reduce the Prism Dimension nerf by ${formatAdd(0.01,0,2)}.`,
    effect: () => 1,
  },
  IDNerf: {
    id: "IDNerf",
    cost: 100,
    checkRequirement: () => AbsurdityUpgrade.PDNerf.isBought,
    description: () => `Reduce the Infinity Dimension nerf by ${formatAdd(0.01,0,2)}.`,
    effect: () => 1,
  },
  IPNerf: {
    id: "IPNerf",
    cost: 3,
    description: () => `Reduce the Infinity Point nerf by ${formatAdd(0.02,0,2)}.`,
    effect: () => 1,
  },
  EPNerf: {
    id: "EPNerf",
    cost: 250,
    checkRequirement: () => AbsurdityUpgrade.IPNerf.isBought,
    description: () => `Reduce the Eternity Point nerf by ${formatAdd(0.03,0,2)}.`,
    effect: () => 1,
  },
  RGCap: {
    id: "RGCap",
    cost: 500,
    checkRequirement: () => AbsurdityUpgrade.EPNerf.isBought,
    description: () => `Time Study 131, 132, 133 gains +${formatPercents(0.1)} to thier Replicanti Galaxies effect.`,
    effect: () => 1.1,
  },
  PPGain: {
    id: "PPGain",
    cost: 5,
    description: () => `Gain More ${formatPow(1.03, 0, 2)} Paradox Power.`,
    effect: () => 1.03,
  },
  AEGain: {
    id: "AEGain",
    cost: 750,
    checkRequirement: () => AbsurdityUpgrade.PPGain.isBought,
    description: () => `Absurdity Energy gain is better.`,
    effect: () => 1,
  },
  SacGain: {
    id: "SacGain",
    cost: 6500,
    formatCost: x => format(x, 1, 0),
    checkRequirement: () => AbsurdityUpgrade.AEGain.isBought,
    description: () => `Dimensional Sacrifice is stronger.`,
    effect: () => 1.5,
  },
};
