import { DC } from "../../constants";

function rebuyableCost(initialCost, increment, id) {
  return Decimal.multiply(initialCost, Decimal.pow(Decimal.mul(increment, ParadoxAchievement(37).effectOrDefault(1)), player.absurdity.quasma.rebuyables[id]));
}

function rebuyable(config) {
  return {
    id: config.id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
    initialCost: config.initialCost,
    increment: config.increment,
    description: config.description,
    effect: () => config.effect(player.absurdity.quasma.rebuyables[config.id]),
    formatEffect: config.formatEffect,
    formatCost: config.formatCost,
    purchaseCap: config.purchaseCap,
    reachedCap: () => player.absurdity.quasma.rebuyables[config.id].gte(config.purchaseCap),
    rebuyable: true
  };
}

export const quasmaUpgrades = {
  chromaticGain: rebuyable({
    id: 1,
    initialCost: 10,
    increment: 10,
    description: () => "Double Chromatic Energy gain",
    effect: bought => {
      return Decimal.pow(2, bought);
    },
    formatEffect: value => {
      const nonInteger = SingularityMilestone.dilatedTimeFromSingularities.canBeApplied ||
        Achievement(187).canBeApplied;
      return formatX(value, 2, nonInteger ? 2 : 0);
    },
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyStrength: rebuyable({
    id: 2,
    initialCost: 2e5,
    increment: 15,
    description: "Increase the strength of Galaxies",
    // The 70th last purchase, make it a whole number
    effect: bought => (bought.lt(70) ? Decimal.pow(1.01, bought) : DC.D2),
    formatEffect: effect => formatPercents(Decimal.sub(effect, 1)),
    formatCost: value => format(value, 2),
    purchaseCap: new Decimal(70)
  }),
  nitronicGain: rebuyable({
    id: 3,
    initialCost: 5e3,
    increment: 30,
    description: () => {
      if (Pelle.isDoomed) return `Multiply the amount of Nitronic Energy gained by ${formatInt(1)}`;
      if (Enslaved.isRunning) return `Multiply the amount of Nitronic Energy gained
      by ${Math.pow(3, Enslaved.tachyonNerf).toFixed(2)}`;
      return "Triple the amount of Nitronic Energy gained";
    },
    effect: bought => {
      if (Pelle.isDoomed) return DC.D1.pow(bought);
      return DC.D3.pow(bought);
    },
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  ADMul: rebuyable({
    id: 4,
    initialCost: 1e6,
    increment: 400,
    description: () => `Multiply Animatier Dimensions by ${formatX('e10000')}.`,
    effect: bought => Decimal.pow('e10000', bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  IDMul: rebuyable({
    id: 5,
    initialCost: 1e6,
    increment: 2000,
    description: () => `Multiply Infinity Dimensions by ${formatX('e1000')}.`,
    effect: bought => Decimal.pow('e1000', bought),
    formatEffect: effect => formatX(effect, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  TDMul: rebuyable({
    id: 6,
    initialCost: 1e6,
    increment: 2e4,
    description: () => `Multiply Time Dimensions by ${formatX('e12')}.`,
    effect: bought => Decimal.pow('e12', bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  autoRGP: {
    id: 7,
    cost: 250,
    description: () => {
      return `Automaticly produce Red, Blue and Purple Light.`;
    },
    effect: () => {
      return DC.D1;
    },
  },
  ADMultCE: {
    id: 8,
    cost: 1e7,
    description: "Antimatter Dimension multiplier based on Chromatic Energy, heavily nerfed in Quasma",
    effect: () => Currency.chromaticEnergy.value.pow(player.absurdity.quasma.active ? 10 : 2500).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  ipMultCE: {
    id: 9,
    cost: 5e4,
    description: "Gain a multiplier to Infinity Points based on Chromatic Energy.",
    effect: () => Currency.chromaticEnergy.value.pow(125).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  buy10Dim: {
    id: 10,
    cost: 5e7,
    description: () => `Per-purchase for All types of Dimensions are increased by ${formatPercents(0.5)}`,
    effect: 1.5
  },
  quasmaPenalty: {
    id: 11,
    cost: 1e9,
    description: () => `Reduce the Quasma penalty by ${formatAdd(0.45, 2, 2)}`,
    effect: 0.45,
  },
  dimNerf: {
    id: 12,
    cost: 2e13,
    description: () => `Reduce the nerf on all Dimension types by ${formatAdd(0.01, 2, 2)}`,
    effect: 1,
  },
  nitronicBoostChromatic: {
    id: 13,
    cost: 1e15,
    description: () => `Nitronic Energy Produces more Chromatic Energy`,
    effect: () => Currency.nitronicEnergy.value.pow(0.33).clamp(1, 1e11),
    formatEffect: value => formatX(value, 2, 1),
    cap: 1e50
  },
  infinityConversion: {
    id: 14,
    cost: 1e25,
    description: () => `Increase the Infinity Dimension Conversion rate by ${formatAdd(1,1,1)}`,
    effect: () => 1,
  },
  AEMulNE: {
    id: 15,
    cost: 5e26,
    description: () => `Absurdity Energy multiplies Nitronic Energy gain and slightly lower the free tickspeed threshold`,
    effect: () => Currency.absurdityEnergy.value.pow(0.125).clamp(1, 1e6),
    formatEffect: value => formatX(value, 2, 1),
    cap: DC.D10000
  },
};
