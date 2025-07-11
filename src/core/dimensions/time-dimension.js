import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function buySingleTimeDimension(tier, auto = false) {
  const dim = TimeDimension(tier);
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics && Currency.eternityPoints.gte(dim.cost)) {
      if (!auto) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (Currency.eternityPoints.lt(dim.cost)) return false;
  if (Enslaved.isRunning && dim.bought.gt(0)) return false;
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(8).completions > 0) {
    if (!auto) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }

  Currency.eternityPoints.subtract(dim.cost);
  dim.amount = dim.amount.add(1);
  dim.bought = dim.bought.add(1);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetTimeDimensions() {
  for (const dim of TimeDimensions.all) dim.amount = new Decimal(dim.bought);
  updateTimeDimensionCosts();
}

export function fullResetTimeDimensions() {
  for (const dim of TimeDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = DC.D0;
  }
}

export function toggleAllTimeDims() {
  const areEnabled = Autobuyer.timeDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.timeDimension(i).isActive = !areEnabled;
  }
}

export function calcHighestPurchaseableTD(tier, currency) {
  const logC = currency.max(1).log10();
  const logBase = TimeDimension(tier)._baseCost.max(1).log10();
  let logMult = Decimal.log10(TimeDimension(tier)._costMultiplier);

  if (tier > 4 && currency.lt(DC.E6000)) {
    return Decimal.max(0, logC.sub(logBase).div(logMult)).floor();
  }

  if (currency.gte(DC.E6000)) {
    logMult = TimeDimension(tier)._costMultiplier.mul(tier <= 4 ? 2.2 : 1).max(1).log10();
    const preInc = Decimal.log10(DC.E6000).sub(logBase).div(logMult);
    const postInc = logC.sub(logBase).sub(6000).div(logMult).div(TimeDimensions.scalingPast1e6000).clampMin(0);
    return postInc.add(preInc).floor();
  }

  if (currency.lt(DC.NUMMAX)) {
    return Decimal.max(0, logC.sub(logBase).div(logMult).add(1)).floor();
  }

  if (currency.lt(DC.E1300)) {
    const preInc = Decimal.log10(DC.NUMMAX).sub(logBase).div(logMult).floor();
    logMult = TimeDimension(tier)._costMultiplier.mul(1.5).max(1).log10();
    const decCur = logC.sub(preInc.mul(logMult));
    const postInc = decCur.div(logMult).clampMin(0).floor();
    return Decimal.add(preInc, postInc);
  }

  if (currency.lt(DC.E6000)) {
    logMult = TimeDimension(tier)._costMultiplier.mul(1.5).max(1).log10();
    const preInc = Decimal.log10(DC.E1300).sub(logBase).div(logMult).floor();
    logMult = TimeDimension(tier)._costMultiplier.mul(2.2).max(1).log10();
    const decCur = logC.sub(preInc.mul(logMult));
    const postInc = decCur.div(logMult).clampMin(0).floor();
    return Decimal.add(preInc, postInc);
  }
  throw new Error("calcHighestPurchasableTD reached too far in code");
}

export function buyMaxTimeDimension(tier, portionToSpend = 1, isMaxAll = false) {
  const canSpend = Currency.eternityPoints.value.times(portionToSpend);
  const dim = TimeDimension(tier);
  if (canSpend.lt(dim.cost)) return false;
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics) {
      if (!isMaxAll) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(8).completions > 0) {
    if (!isMaxAll) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }

  if (Enslaved.isRunning) return buySingleTimeDimension(tier);
  const pur = Decimal.sub(calcHighestPurchaseableTD(tier, canSpend), dim.bought).clampMin(0);
  const cost = dim.nextCost(pur.add(dim.bought).sub(1));
  if (pur.lte(0)) return false;
  Currency.eternityPoints.subtract(cost);
  dim.amount = dim.amount.plus(pur);
  dim.bought = dim.bought.add(pur);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllTimeDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && TimeDimension(i).bought.eq(0); i--) {
    buySingleTimeDimension(i, true);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 8; i > 0; i--) {
    buyMaxTimeDimension(i, 0.01, true);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const tierCheck = tier => (RealityUpgrade(13).isLockingMechanics ? tier < 5 : true);
  const purchasableDimensions = TimeDimensions.all.filter(d => d.isUnlocked && tierCheck(d.tier));
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleTimeDimension(cheapestDim.tier, true)) break;
  }
}

export function timeDimensionCommonMultiplier() {
  let mult = new Decimal(1)
    .timesEffectsOf(
      Achievement(105),
      TimeStudy(94),
      TimeStudy(104),
      TimeStudy(151),
      TimeStudy(221),
      TimeStudy(301),
      EternityChallenge(1).reward,
      EternityChallenge(11).reward,
      EternityUpgrade.tdMultAchs,
      EternityUpgrade.tdMultTheorems,
      EternityUpgrade.tdMultRealTime,
      Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
      Pelle.isDoomed ? null : RealityUpgrade(22),
      AlchemyResource.dimensionality,
      PelleRifts.chaos
    );

  if (EternityChallenge(10).isRunning) {
    mult = mult.times(
      Decimal.pow(
        // eslint-disable-next-line max-len
        Decimal.clampMin(Currency.infinityPower.value.max(1).pow(InfinityDimensions.powerConversionRate.div(7)).log2().pow(10), 1),
        4)
        .clampMin(1));
  }
  return mult;
}

export function updateTimeDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = TimeDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

class TimeDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.time, tier);
    const BASE_COSTS = [null, DC.D1, DC.D5, DC.E2, DC.E3, DC.E1100, DC.E1500, DC.E3000, DC.E3350];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 9, 27, 81, 24300, 72900, 218700, 656100].map(e => (e ? new Decimal(e) : null));
    this._costMultiplier = COST_MULTS[tier];
    // eslint-disable-next-line max-len
    const E6000_SCALING_AMOUNTS = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456].map(e => (e ? new Decimal(e) : null));
    this._e6000ScalingAmount = E6000_SCALING_AMOUNTS[tier];
    const COST_THRESHOLDS = [DC.NUMMAX, DC.E1300, DC.E6000];
    this._costIncreaseThresholds = COST_THRESHOLDS;
  }

  /** @returns {Decimal} */
  get cost() {
    return this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    if (this._tier > 4 && bought.lt(this.e6000ScalingAmount)) {
      const cost = Decimal.pow(this.costMultiplier, bought).times(this.baseCost);
      if (PelleRifts.paradox.milestones[0].canBeApplied) {
        return cost.div("1e2250").pow(0.5);
      }
      return cost;
    }

    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < this._costIncreaseThresholds.length; i++) {
      const cost = Decimal.pow(this.costMultiplier.mul(costMultIncreases[i]), bought).times(this.baseCost);
      if (cost.lt(this._costIncreaseThresholds[i])) return cost;
    }

    let base = this.costMultiplier;
    if (this._tier <= 4) base = base.mul(2.2);
    const exponent = this.e6000ScalingAmount.add((bought.sub(this.e6000ScalingAmount))
      .times(TimeDimensions.scalingPast1e6000));
    const cost = Decimal.pow(base, exponent).times(this.baseCost);

    if (PelleRifts.paradox.milestones[0].canBeApplied && this._tier > 4) {
      return cost.div("1e2250").pow(0.5);
    }
    return cost;
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isAffordable() {
    return Currency.eternityPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(12).isRunning) return DC.D1.mul(Currency.prismEnergy.value.pow(PrismDimensions.conversionRate).max(1));
    let mult = GameCache.timeDimensionCommonMultiplier.value
      .timesEffectsOf(
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(74) : null,
        tier === 4 ? TimeStudy(227) : null,
        QuasmaUpgrade.TDMul
      );

    const dim = TimeDimension(tier);
    const bought = tier === 8 ? Decimal.clampMax(dim.bought, 1e8) : dim.bought;
    mult = mult.times(Decimal.pow( Decimal.mul(dim.powerMultiplier, QuasmaUpgrade.buy10Dim.effectOrDefault(1)), bought));

    mult = mult.pow(getAdjustedGlyphEffect("timepow"));
    mult = mult.pow(getAdjustedGlyphEffect("effarigdimensions"));
    mult = mult.pow(getAdjustedGlyphEffect("curseddimensions"));
    mult = mult.powEffectOf(AlchemyResource.time);
    mult = mult.pow(Ra.momentumValue);
    mult = mult.pow(ImaginaryUpgrade(11).effectOrDefault(1));
    mult = mult.powEffectOf(PelleRifts.paradox);
    mult = mult.pow(Achievement(128).effectOrDefault(1));

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(mult);
    }

    if (player.absurdity.quasma.active) mult = quasmaValueOf(mult);

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }

    return mult.pow([0.2, QuasmaUpgrade.dimNerf.isBought ? 0.01 : 0].sum());
  }

  get productionPerSecond() {
    if (EternityChallenge(1).isRunning || EternityChallenge(11).isRunning ||
    (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return DC.D0;
    }
    if (EternityChallenge(12).isRunning) {
      return this.amount.mul(this.multiplier);
    }
    let production = this.amount.times(this.multiplier);
    if (EternityChallenge(8).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }
    if (this._tier === 1 && !EternityChallenge(8).isRunning) {
      production = production.pow(getAdjustedGlyphEffect("timeshardpow"));
    }
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get isProducing() {
    const tier = this.tier;
    if (EternityChallenge(1).isRunning ||
      EternityChallenge(11).isRunning ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    return DC.D4
      .times(this._tier === 8 ? GlyphInfo.time.sacrificeInfo.effect() : new Decimal(1))
      .pow(ImaginaryUpgrade(14).effectOrDefault(1));
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }

  get costIncreaseThresholds() {
    return this._costIncreaseThresholds;
  }

  get requirementReached() {
    return this._tier < 5 ||
      (TimeStudy.timeDimension(this._tier).isAffordable && TimeStudy.timeDimension(this._tier - 1).isBought);
  }

  tryUnlock() {
    if (this.isUnlocked) return;
    TimeStudy.timeDimension(this._tier).purchase();
  }
}

/**
 * @function
 * @param {number} tier
 * @return {TimeDimensionState}
 */
export const TimeDimension = TimeDimensionState.createAccessor();

export const TimeDimensions = {
  /**
   * @type {TimeDimensionState[]}
   */
  all: TimeDimension.index.compact(),

  get scalingPast1e6000() {
    return 4;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      TimeDimension(tier).produceDimensions(TimeDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(8).isRunning) {
      TimeDimension(1).produceDimensions(InfinityDimension(8), diff);
    } else {
      TimeDimension(1).produceCurrency(Currency.timeShards, diff);
    }

    EternityChallenge(8).reward.applyEffect(production => {
      InfinityDimension(8).amount = InfinityDimension(8).amount.plus(production.times(diff.div(1000)));
    });
  }
};

export function tryUnlockTimeDimensions() {
  if (TimeDimension(8).isUnlocked) return;
  for (let tier = 5; tier <= 8; ++tier) {
    if (TimeDimension(tier).isUnlocked) continue;
    TimeDimension(tier).tryUnlock();
  }
}
