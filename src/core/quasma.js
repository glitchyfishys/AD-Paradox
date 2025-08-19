import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";

export function startQuasmaAbsurdityRequest() {
  if (!PlayerProgress.quasmaUnlocked() || (Pelle.isDoomed && !Pelle.canDilateInPelle)) return;
  if (player.absurdity.quasma.active) {
    if (player.options.confirmations.quasma) {
      Modal.exitQuasma.show();
    } else {
      absurdityReset(true);
    }
  } else if (player.options.confirmations.quasma) {
    Modal.enterQuasma.show();
  } else {
    startQuasmaAbsurdity();
  }
}

export function startQuasmaAbsurdity(auto) {
  if (!PlayerProgress.quasmaUnlocked()) return false;
  if (GameEnd.creditsEverClosed) return false;
  if (player.absurdity.quasma.active) {
    absurdityReset(true);
    return false;
  }
  ParadoxAchievement(34).unlock();
  absurdityReset(true);
  player.absurdity.quasma.active = true;
  if (Pelle.isDoomed) PelleStrikes.quasma.trigger();
  return true;
}

export function buyQuasmaUpgrade(id, bulk = 1) {
  if (GameEnd.creditsEverClosed) return false;
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = QuasmaUpgrade.all[id - 1];
  if (id > 6) {
    if (player.absurdity.quasma.upgrades.has(id)) return false;
    if (!Currency.chromaticEnergy.purchase(upgrade.cost)) return false;
    player.absurdity.quasma.upgrades.add(id);
  } else {
    const upgAmount = player.absurdity.quasma.rebuyables[id];
    if (Currency.chromaticEnergy.lt(upgrade.cost) || upgAmount.gte(upgrade.config.purchaseCap)) return false;

    let buying = Decimal.affordGeometricSeries(Currency.chromaticEnergy.value,
      upgrade.config.initialCost, Decimal.mul(upgrade.config.increment, ParadoxAchievement(37).effectOrDefault(1)), upgAmount);
    buying = Decimal.clampMax(buying, bulk);
    buying = Decimal.clampMax(buying, upgrade.config.purchaseCap.sub(upgAmount));
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, Decimal.mul(upgrade.config.increment, ParadoxAchievement(37).effectOrDefault(1)), upgAmount);
    Currency.chromaticEnergy.subtract(cost);
    player.absurdity.quasma.rebuyables[id] = player.absurdity.quasma.rebuyables[id].add(buying);
    
    if (id === 3 && !Pelle.isDisabled("tpMults")) {
      let retroactiveTPFactor = Effects.max(
        DC.D1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      if (Enslaved.isRunning) {
        retroactiveTPFactor = Decimal.pow(retroactiveTPFactor, Enslaved.nitronicNerf);
      }
      Currency.nitronicEnergy.multiply(Decimal.pow(retroactiveTPFactor, buying));
    }

  }
  return true;
}

export function maxPurchaseQuasmaUpgrades() {
  if (Pelle.isDoomed) return false;
  QuasmaUpgrades.rebuyable.forEach(u => u.purchase(1e50));
}

export function getChromaticEnergyGainPerSecond() {

  let CERate = new Decimal(Currency.nitronicEnergy.value)
    .timesEffectsOf(
      QuasmaUpgrade.chromaticGain,
      QuasmaUpgrade.nitronicBoostChromatic,
      ParadoxAchievement(35),
    );

    CERate = CERate.mul(getAdjustedGlyphEffect('prismchrome'));

  if (Enslaved.isRunning && !CERate.eq(0)) CERate = Decimal.pow10(Decimal.pow(CERate.plus(1).log10(), 0.35).sub(1));
  if (V.isRunning) CERate = CERate.pow(0.5);

  return CERate;
}

export function nitronicGainMultiplier() {
  if (Pelle.isDisabled("tpMults")) return new Decimal(1);
  const pow = Enslaved.isRunning ? Enslaved.nitronicNerf : 1;
  return DC.D1.timesEffectsOf(
    QuasmaUpgrade.nitronicGain,
    QuasmaUpgrade.AEMulNE,
    ParadoxAchievement(36)
  ).pow(pow).mul(5);
}

export function rewardNE() {
  Currency.nitronicEnergy.bumpTo(getNE(player.records.thisEternity.maxAM, true));
}

// This function exists to apply Teresa-25 in a consistent way; TP multipliers can be very volatile and
// applying the reward only once upon unlock promotes min-maxing the upgrade by unlocking quasma with
// TP multipliers as large as possible. Applying the reward to a base TP value and letting the multipliers
// act dynamically on this fixed base value elsewhere solves that issue
export function getBaseNE(antimatter) {
  const am = (isInCelestialReality() || Pelle.isDoomed)
    ? antimatter
    : Ra.unlocks.unlockDilationStartingTP.effectOrDefault(antimatter);
  let baseTP = am.max(1).log10().div(250).pow(1.33);
  if (Enslaved.isRunning) baseTP = baseTP.pow(Enslaved.nitronicNerf);
  return baseTP;
}

// Returns the TP that would be gained this run
export function getNE(antimatter) {
  return getBaseNE(antimatter).times(nitronicGainMultiplier());
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit quasma" button (saying whether you need more antimatter), and in last 10 eternities
export function getNitronicGain() {
  return getNE(Currency.antimatter.value).minus(Currency.nitronicEnergy.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getNitronicReq() {
  let effectiveNE = Currency.nitronicEnergy.value.dividedBy(nitronicGainMultiplier());
  if (Enslaved.isRunning) effectiveNE = effectiveNE.pow(1 / Enslaved.nitronicNerf);
  return Decimal.pow10(
    effectiveNE
      .times(250 ** 1.33)
      .pow(1 / 1.33)
  );
}

export function getChromaticEnergyEstimate(goal) {
  const currentCEGain = getChromaticEnergyGainPerSecond();
  const rawCEGain = currentCEGain.times(getGameSpeedupForDisplay());
  const currentCE = Currency.chromaticEnergy.value;
  if (currentCEGain.eq(0)) return null;

  return TimeSpan.fromSeconds(Decimal.sub(goal, currentCE)
    .div(rawCEGain)).toTimeEstimate();
}

export function quasmaValueOf(value) {
  const log10 = value.eq(0) ? DC.D0 : value.log10();
  const quasmaPenalty = Effects.sum(QuasmaUpgrade.quasmaPenalty).add(ParadoxAchievement(37).isEffectActive ? 0.1 : 0).add(0.05);
  return Decimal.pow10(log10.abs().pow(quasmaPenalty).times(Decimal.sign(log10)));
}

class QuasmaUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.chromaticEnergy;
  }

  get set() {
    return player.absurdity.quasma.upgrades;
  }

  onPurchased() {

  }
}

class RebuyableQuasmaUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.chromaticEnergy;
  }

  get boughtAmount() {
    return player.absurdity.quasma.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.absurdity.quasma.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.config.reachedCap();
  }

  purchase(bulk) {
    buyQuasmaUpgrade(this.config.id, bulk);
  }
}

export const QuasmaUpgrade = mapGameDataToObject(
  GameDatabase.absurdity.quasmaUpgrades,
  config => (config.rebuyable
    ? new RebuyableQuasmaUpgradeState(config)
    : new QuasmaUpgradeState(config))
);

export const QuasmaUpgrades = {
  rebuyable: [
    QuasmaUpgrade.chromaticGain,
    QuasmaUpgrade.galaxyStrength,
    QuasmaUpgrade.nitronicGain,
    QuasmaUpgrade.ADMul,
    QuasmaUpgrade.IDMul,
    QuasmaUpgrade.TDMul,
  ],
  fromId: id => QuasmaUpgrade.all.find(x => x.id === Number(id))
};
