import { DC } from "../../constants";

function rebuyableCost(initialCost, increment, id) {
  return Decimal.multiply(initialCost, Decimal.pow(increment, player.dilation.rebuyables[id]));
}
function rebuyable(config) {
  return {
    id: config.id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
    initialCost: config.initialCost,
    increment: config.increment,
    description: config.description,
    effect: () => config.effect(player.dilation.rebuyables[config.id]),
    formatEffect: config.formatEffect,
    formatCost: config.formatCost,
    purchaseCap: config.purchaseCap,
    reachedCap: () => player.dilation.rebuyables[config.id].gte(config.purchaseCap),
    pelleOnly: Boolean(config.pelleOnly),
    rebuyable: true
  };
}

export const dilationUpgrades = {
  dtGain: rebuyable({
    id: 1,
    initialCost: 1e4,
    increment: 10,
    description: () =>
      ((SingularityMilestone.dilatedTimeFromSingularities.canBeApplied || Achievement(187).canBeApplied)
        ? `${formatX(Effects.product(
          SingularityMilestone.dilatedTimeFromSingularities,
          Achievement(187)
        ).mul(2), 2, 2)} Dilated Time gain`
        : "Double Dilated Time gain"),
    effect: bought => {
      const base = Effects.product(
        SingularityMilestone.dilatedTimeFromSingularities,
        Achievement(187)
      ).mul(2);
      return Decimal.pow(base, bought);
    },
    formatEffect: value => {
      const nonInteger = SingularityMilestone.dilatedTimeFromSingularities.canBeApplied ||
        Achievement(187).canBeApplied;
      return formatX(value, 2, nonInteger ? 2 : 0);
    },
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyThreshold: rebuyable({
    id: 2,
    initialCost: 1e6,
    increment: 100,
    description: () =>
      (Perk.bypassTGReset.isBought && !Pelle.isDoomed
        ? "Reset Tachyon Galaxies, but lower their threshold"
        : "Reset Dilated Time and Tachyon Galaxies, but lower their threshold"),
    // The 38th purchase is at 1e80, and is the last purchase.
    effect: bought => (bought.lt(38) ? Decimal.pow(0.8, bought) : new Decimal()),
    formatEffect: effect => {
      if (effect === 0) return `${formatX(getTachyonGalaxyMult(effect), 4, 4)}`;
      const nextEffect = effect === Decimal.pow(0.8, 37) ? new Decimal() : effect.mul(0.8);
      return `${formatX(getTachyonGalaxyMult(effect), 4, 4)} ➜
        Next: ${formatX(getTachyonGalaxyMult(nextEffect), 4, 4)}`;
    },
    formatCost: value => format(value, 2),
    purchaseCap: new Decimal(38)
  }),
  tachyonGain: rebuyable({
    id: 3,
    initialCost: 1e7,
    increment: 20,
    description: () => {
      if (Pelle.isDoomed) return `Multiply the amount of Tachyon Particles gained by ${formatInt(1)}`;
      if (Enslaved.isRunning) return `Multiply the amount of Tachyon Particles gained
      by ${Math.pow(3, Enslaved.tachyonNerf).toFixed(2)}`;
      return "Triple the amount of Tachyon Particles gained";
    },
    effect: bought => {
      if (Pelle.isDoomed) return DC.D1.pow(bought);
      return DC.D3.pow(bought);
    },
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  doubleGalaxies: {
    id: 4,
    cost: 5e6,
    description: () => `Gain twice as many Tachyon Galaxies, up to ${formatInt(500)} base Galaxies`,
    effect: 2
  },
  tdMultReplicanti: {
    id: 5,
    cost: 1e9,
    description: () => {
      const rep10 = replicantiMult().pLog10();
      let multiplier = "0.1";
      if (rep10.gt(20000)) {
        const ratio = DilationUpgrade.tdMultReplicanti.effectValue.pLog10().div(rep10);
        if (ratio.lt(0.095)) {
          multiplier = ratio.toFixed(2);
        }
      }
      return `Time Dimensions are affected by Replicanti multiplier ${formatPow(multiplier, 1, 3)}, reduced
        effect above ${formatX(DC.E20000)}`;
    },
    effect: () => {
      let rep10 = replicantiMult().pLog10().div(5);
      rep10 = rep10.gt(20000) ? new Decimal(20000).add((rep10.sub(2e4)).div(2)) : rep10;
      return Decimal.pow10(rep10);
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  ndMultDT: {
    id: 6,
    cost: 5e7,
    description: "Antimatter Dimension multiplier based on Dilated Time, unaffected by Time Dilation",
    effect: () => Currency.dilatedTime.value.pow(1000).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  ipMultDT: {
    id: 7,
    cost: 2e12,
    description: "Gain a multiplier to Infinity Points based on Dilated Time",
    effect: () => Currency.dilatedTime.value.pow(5000).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  timeStudySplit: {
    id: 8,
    cost: 1e10,
    description: "You can buy a Third Time Study path from the Dimension Split"
  },
  dilationPenalty: {
    id: 9,
    cost: 1e11,
    description: () => `Reduce the Dilation penalty (${formatPow(1.1, 2, 2)} after reduction)`,
    effect: 1.1,
  },
  ttGenerator: {
    id: 10,
    cost: 1e15,
    description: "Generate Time Theorems based on Tachyon Particles",
    effect: () => Currency.tachyonParticles.value.div(20000),
    formatEffect: value => `${format(value, 2, 1)}/sec`
  },
  dtGainPelle: rebuyable({
    id: 11,
    initialCost: 1e14,
    increment: 100,
    pelleOnly: true,
    description: () => `${formatX(5)} Dilated Time gain`,
    effect: bought => Decimal.pow(5, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyMultiplier: rebuyable({
    id: 12,
    initialCost: 1e15,
    increment: 1000,
    pelleOnly: true,
    description: "Multiply Tachyon Galaxies gained, applies after TG doubling upgrade",
    effect: bought => bought.add(1),
    formatEffect: value => `${formatX(value, 2)} ➜ ${formatX(value.add(1), 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  tickspeedPower: rebuyable({
    id: 13,
    initialCost: 1e16,
    increment: 1e4,
    pelleOnly: true,
    description: "Gain a power to Tickspeed",
    effect: bought => bought.mul(0.03).add(1),
    formatEffect: value => `${formatPow(value, 2, 2)} ➜ ${formatPow(value.add(0.03), 2, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: DC.BEMAX
  }),
  galaxyThresholdPelle: {
    id: 14,
    cost: 1e45,
    pelleOnly: true,
    description: "Apply a cube root to the Tachyon Galaxy threshold",
    effect: 1 / 3
  },
  flatDilationMult: {
    id: 15,
    cost: 1e55,
    pelleOnly: true,
    description: () => `Gain more Dilated Time based on current EP`,
    effect: () => DC.E9.pow((Decimal.max(player.eternityPoints.max(1).log10().sub(1500), 0).div(2500)).pow(1.2).clampMax(1)),
    formatEffect: value => formatX(value, 2, 2)
  },
};
