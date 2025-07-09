import { AbsurdityUpgrade } from "./absurdity-upgrades";
import { DC } from "./constants";
import { absurdityUpgrades } from "./secret-formula/absurdity/absurdity-upgrades";

export function manualAbsurdityResetRequest() {
  if (!Player.canAbsurdity) return;
  if (GameEnd.creditsEverClosed) return;

  if (player.options.confirmations.absurdity) {
    Modal.absurdity.show();
  } else {
    absurdityResetRequest();
  }
}

export function absurdityResetRequest() {
  if (!Player.canAbsurdity) return;
  absurdityReset();
}

export function absurdityReset( forced = false) {
  if (!forced && !Player.canAbsurdity) return;

  if (Player.canAbsurdity) {
    EventHub.dispatch(GAME_EVENT.ABSURDITY_RESET_BEFORE);
    absurdityGiveRewards();
  }

  if (player.absurdity.quasma.active) {
    player.absurdity.quasma.recordAM = player.absurdity.quasma.recordAM.max(Currency.antimatter.value);
    player.absurdity.quasma.active = false;
    rewardNE();
  }

  absurdity();
  EventHub.dispatch(GAME_EVENT.ABSURDITY_AFTER);
}

function absurdityGiveRewards() {

  const AE = gainedAbsurdityEnergy();
  Currency.absurdityEnergy.add(AE);

  Currency.absurdities.bumpTo(Currency.eternities.value);

}

function absurdity() {

  player.sacrificed = DC.D0;

  PrismDimensions.fullReset();
  Currency.prismEnergy.reset();
  Currency.paradoxPower.reset();
  player.paradox.prism.unlockBits = 0;
  Currency.light.red = DC.D0;
  Currency.light.blue = DC.D0;
  Currency.light.purple = DC.D0;

  if(!EternityMilestone.unlockReplicanti.isReached) player.paradox.prismUpgrades.clear();

  if (!PrismUpgrade.KeepRow2_1.isEffectActive) {
    player.paradox.upgrades.clear();
    if (ParadoxAchievement(23).isEffectActive) player.paradox.upgrades = new Set(["ADbuy10_1", "BaseAD_1", "Dimboost_1", "Tickspeed_1", "Ach_1"]);
  }

  initializeChallengeCompletions(true);

  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.records.bestInfinity.time = DC.BEMAX;
  player.records.bestInfinity.realTime = DC.BEMAX;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = DC.D0;
  player.dimensionBoosts = DC.D0;
  player.galaxies = DC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  if(Currency.eternities.lt(2)) player.break = false;
  player.IPMultPurchases = DC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  Replicanti.reset(true);

  Currency.eternityPoints.reset();

  
  EternityUpgrade.epMult.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = DC.D0;
  player.records.bestEternity.time = DC.BEMAX;
  player.records.bestEternity.realTime = DC.BEMAX;
  player.records.bestEternity.bestEPminReality = DC.D0;
  if (!PelleUpgrade.keepEternityUpgrades.canBeApplied) player.eternityUpgrades.clear();
  player.totalTickGained = DC.D0;
  player.challenge.eternity.current = 0;
  if (!PelleUpgrade.timeStudiesNoReset.canBeApplied) player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  
  if (!PelleUpgrade.timeStudiesNoReset.canBeApplied) Currency.timeTheorems.reset();
  player.celestials.v.STSpent = 0;
  if (!PelleUpgrade.timeStudiesNoReset.canBeApplied) {
    player.dilation.active = false;
  }

  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  player.dilation.lastEP = DC.DM1;
  Currency.antimatter.reset();
  Enslaved.autoReleaseTick = 0;
  player.celestials.enslaved.hasSecretStudy = false;

  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  resetEternityRuns();
  InfinityDimensions.fullReset();
  fullResetTimeDimensions();
  resetChallengeStuff();
  AntimatterDimensions.reset();
  secondSoftReset(false);

  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  
  resetTimeDimensions();
  resetTickspeed();
  AchievementTimers.marathon2.reset();
  Currency.infinityPoints.reset();

  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();
  EventHub.dispatch(GAME_EVENT.ABSURDITY_RESET_AFTER);
}

export function gainedAbsurdityEnergy(){
  if (EternityChallenge(8).isRunning) return DC.D0;
  let AE = Decimal.max(TimeDimension(1).amount.add(10).log10().sub(6), DC.D1).pow(1.25);

  if (AE.gt(40)) {
    AE = AE.mul(Decimal.pow10(TimeDimension(1).amount.max(1).log10().div(40).sub(1)));
  }

  if (AbsurdityUpgrade.AEGain.isBought) AE = AE.pow(1.25);
  else AE;

  return AE;
}
