import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function prismDimensionCommonMultiplier() {
  let mult = new Decimal(1)

  return mult;
}

export function toggleAllPrismDims() {
  const areEnabled = Autobuyer.prismDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.prismDimension(i).isActive = !areEnabled;
  }
}

class PrismDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.prism, tier);

    const COST_MULTS = [null, DC.E3, DC.E6, DC.E8, DC.E10, DC.E15, DC.E20, DC.E25, DC.E30];
    this._baseCostMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 100, 50, 30, 20, 15, 10, 5, 5];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, DC.E6, DC.E7, DC.E10, DC.E15, DC.E24, DC.E40, DC.E80, DC.E200];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
  }

  /**
   * @returns {ExponentialCostScaling}
   */
  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this._baseCost,
      baseIncrease: this._baseCostMultiplier,
      costScale: DC.E2,
      scalingCostThreshold: DC.NUMMAX
    });
  }

  get cost() {
    return this.costScale.calculateCost(this.bought.floor());
  }
  
  get bought() {
    return this.data.bought;
  }

  set bought(value) {
    return this.data.bought = value;
  }

  get isUnlocked() {
    return true;
  }

  get isAvailableForPurchase() {
    return PrismDimensions.canBuy() && this.isUnlocked && this.isAffordable;
  }

  get isAffordable() {
    return Currency.paradoxPower.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = DC.D0;
    if (tier === 8) {
      if (EternityChallenge(8).isRunning) toGain = InfinityDimension(1).multiplier.mul(InfinityDimension(1).amount);
    } else {
      toGain = PrismDimension(tier + 1).productionPerSecond;
    }
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get productionPerSecond() {
    if (EternityChallenge(2).isRunning || EternityChallenge(11).isRunning ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return DC.D0;
    }
    let production = this.amount;
    if (EternityChallenge(12).isRunning) {
      return production;
    }
    if (EternityChallenge(8).isRunning) {
      production = production.times(Tickspeed.perSecond);
    }

    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    if (EternityChallenge(12).isRunning) return DC.D1;
    let mult = GameCache.prismDimensionCommonMultiplier.value
    mult = mult.times(Decimal.pow(Decimal.mul(this.powerMultiplier, QuasmaUpgrade.buy10Dim.effectOrDefault(1)), Decimal.floor(this.bought)));

    mult = mult.timesEffectsOf(
      PrismUpgrade.IPBoostPD,
      TimeStudy(82),
      TimeStudy(92),
      TimeStudy(102),
      TimeStudy(162),
    )

    if(tier == 1) {
      mult = mult.mul(PrismUpgrade.PPBoostPD_1.effectOrDefault(1));
      mult = mult.mul(EternityChallenge(2).reward.effectOrDefault(1));
    }
    if(tier == 2) mult = mult.mul(TimeStudy(72).effectOrDefault(1));

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(mult);
    }

    if (player.absurdity.quasma.active) mult = quasmaValueOf(mult);

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }

    mult = mult.pow([0.2, AbsurdityUpgrade.PDNerf.isBought ? 0.01 : 0, QuasmaUpgrade.dimNerf.isBought ? 0.01 : 0].sum());

    return mult;
  }

  get isProducing() {
    const tier = this.tier;
    if (EternityChallenge(2).isRunning ||
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
    let costMult = new Decimal(this._costMultiplier);
    return costMult;
  }

  get powerMultiplier() {
    return new Decimal(this._powerMultiplier);
  }

  get purchases() {
    return this.data.bought;
  }

  resetAmount() {
    this.amount = Decimal.mul(10, this.bought);
  }

  fullReset() {
    this.amount = DC.D0;
    this.bought = DC.D0;
  }

  // Only ever called from manual actions
  buySingle() {
    if (!this.isAvailableForPurchase) return false;

    Currency.paradoxPower.purchase(this.cost);
    this.amount = this.amount.plus(10);
    this.bought = this.bought.plus(1);

    return true;
  }

  buyMax() {
    if (!this.isAvailableForPurchase) return false;

    const costScaling = this.costScale.getMaxBought(this.bought, Currency.paradoxPower.value, DC.D1);
    if (costScaling.quantity == null) return false;

    Currency.paradoxPower.purchase(Decimal.pow10(costScaling.logPrice).div(this._baseCostMultiplier));
    this.bought = this.bought.plus(costScaling.quantity);
    this.amount = this.amount.plus(costScaling.quantity.times(10));

    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {PrismDimensionState}
 */
export const PrismDimension = PrismDimensionState.createAccessor();

export const PrismDimensions = {
  /**
   * @type {PrismDimensionState[]}
   */
  all: PrismDimension.index.compact(),

  resetAmount() {
    Currency.prismEnergy.reset();
    for (const dimension of PrismDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of PrismDimensions.all) {
      dimension.fullReset();
    }
  },

  canBuy() {
    return !EternityChallenge(2).isRunning &&
      !EternityChallenge(11).isRunning;
  },

  canAutobuy() {
    return this.canBuy();
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      PrismDimension(tier).produceDimensions(PrismDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(8).isRunning) {
      if (!NormalChallenge(10).isRunning) {
        PrismDimension(1).produceDimensions(AntimatterDimension(7), diff);
      }
    } else {
      PrismDimension(1).produceCurrency(Currency.prismEnergy, diff);
    }
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    this.all.forEach(dimension => dimension.buyMax(false));
  },

  get conversionRate() {
    return new Decimal(0.05).add(EternityChallenge(12).isRunning ? (EternityChallenge(12).completions * 0.25) : 0);
  }
};
