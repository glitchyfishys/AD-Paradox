import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

function giveEternityRewards(auto) {
  player.records.bestEternity.time = Decimal.min(player.records.thisEternity.time, player.records.bestEternity.time);
  Currency.eternityPoints.add(gainedEternityPoints());

  const newEternities = gainedEternities();

  if (Currency.eternities.eq(0) && newEternities.lte(10)) {
    Tab.dimensions.time.show();
  }

  Currency.eternities.add(newEternities);

  if (EternityChallenge.isRunning) {
    const challenge = EternityChallenge.current;
    challenge.addCompletion(false);
    if (Perk.studyECBulk.isBought) {
      let completionCount = 0;
      while (!challenge.isFullyCompleted && challenge.canBeCompleted) {
        challenge.addCompletion(false);
        completionCount++;
      }
      AutomatorData.lastECCompletionCount = completionCount;
      if (Enslaved.isRunning && completionCount > 5) EnslavedProgress.ec1.giveProgress();
    }
    player.challenge.eternity.requirementBits &= ~(1 << challenge.id);
    respecTimeStudies(auto);
  }

  addEternityTime(
    player.records.thisEternity.trueTime,
    player.records.thisEternity.time,
    player.records.thisEternity.realTime,
    gainedEternityPoints(),
    newEternities
  );

  player.records.thisReality.bestEternitiesPerMs = player.records.thisReality.bestEternitiesPerMs.clampMin(
    newEternities.div(Decimal.clampMin(33, player.records.thisEternity.realTime))
  );
  player.records.bestEternity.bestEPminReality =
    player.records.bestEternity.bestEPminReality.max(player.records.thisEternity.bestEPmin);

  player.records.bestEternity.trueTime = Math.min(player.records.bestEternity.trueTime, player.records.thisEternity.trueTime);
  Currency.infinitiesBanked.value = Currency.infinitiesBanked.value.plusEffectsOf(
    Achievement(131).effects.bankedInfinitiesGain,
    TimeStudy(191)
  );

  if (Effarig.isRunning && !EffarigUnlock.eternity.isUnlocked) {
    EffarigUnlock.eternity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function eternityAnimation() {
  FullScreenAnimationHandler.display("a-eternify", 3);
}

export function eternityResetRequest() {
  if (!Player.canEternity) return;
  if (GameEnd.creditsEverClosed) return;
  askEternityConfirmation();
}

export function eternity(force, auto, specialConditions = {}) {
  if (specialConditions.switchingDilation && !Player.canEternity) {
    // eslint-disable-next-line no-param-reassign
    force = true;
  }
  // We define this variable so we can use it in checking whether to give
  // the secret achievement for respec without studies.
  // Annoyingly, we need to check for studies right here; giveEternityRewards removes studies if we're in an EC,
  // so doing the check later doesn't give us the initial state of having studies or not.
  const noStudies = player.timestudy.studies.length === 0;
  if (!force) {
    if (!Player.canEternity) return false;
    if (RealityUpgrade(10).isLockingMechanics) {
      RealityUpgrade(10).tryShowWarningModal();
      return false;
    }
    if (RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) {
      RealityUpgrade(12).tryShowWarningModal();
      return false;
    }
    EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_BEFORE);
    giveEternityRewards(auto);
    player.requirementChecks.reality.noEternities = false;
  }

  if (player.dilation.active) rewardTP();

  // This needs to be after the dilation check for the "can gain TP" check in rewardTP to be correct.
  if (force) {
    player.challenge.eternity.current = 0;
  }

  initializeChallengeCompletions();
  initializeResourcesAfterEternity();

  if (!EternityMilestone.keepAutobuyers.isReached && !(Pelle.isDoomed && PelleUpgrade.keepAutobuyers.canBeApplied)) {
    // Fix infinity because it can only break after big crunch autobuyer interval is maxed
    player.break = false;
  }

  player.challenge.eternity.current = 0;
  if (!specialConditions.enteringEC && !Pelle.isDoomed) {
    player.dilation.active = false;
  }
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  Replicanti.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();

  if (!specialConditions.enteringEC && player.respec) {
    if (noStudies) {
      SecretAchievement(34).unlock();
    }
    respecTimeStudies(auto);
    player.respec = false;
  }

  Currency.infinityPoints.reset();
  InfinityDimensions.resetAmount();
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  resetTimeDimensions();
  resetTickspeed();
  playerInfinityUpgradesOnReset();
  AchievementTimers.marathon2.reset();
  applyEU1();
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisEternity.maxAM = DC.D0;
  Currency.antimatter.reset();
  ECTimeStudyState.invalidateCachedRequirements();

  PrismDimensions.fullReset();
  Currency.prismEnergy.reset();
  Currency.paradoxPower.reset();
  
  Currency.light.red = DC.D0;
  Currency.light.blue = DC.D0;
  Currency.light.purple = DC.D0;

  if(!EternityMilestone.unlockReplicanti.isReached) player.paradox.prismUpgrades.clear();

  if (!PrismUpgrade.KeepRow2_1.isEffectActive) {
    player.paradox.upgrades.clear();
    if (ParadoxAchievement(23).isEffectActive) player.paradox.upgrades = new Set(["ADbuy10_1", "BaseAD_1", "Dimboost_1", "Tickspeed_1", "Ach_1"]);
  }

  PelleStrikes.eternity.trigger();

  EventHub.dispatch(GAME_EVENT.ETERNITY_RESET_AFTER);
  return true;
}

// eslint-disable-next-line no-empty-function
export function animateAndEternity(callback) {
  if (!Player.canEternity) return false;
  const hasAnimation = !FullScreenAnimationHandler.isDisplaying &&
    !RealityUpgrade(10).isLockingMechanics &&
    !(RealityUpgrade(12).isLockingMechanics && EternityChallenge(1).isRunning) &&
    ((player.dilation.active && player.options.animations.dilation) ||
    (!player.dilation.active && player.options.animations.eternity));

  if (hasAnimation) {
    if (player.dilation.active) {
      animateAndUndilate(callback);
    } else {
      eternityAnimation();
      setTimeout(() => {
        eternity();
        if (callback) callback();
      }, 2250);
    }
  } else {
    eternity();
    if (callback) callback();
  }
  return hasAnimation;
}

export function initializeChallengeCompletions(isReality) {
  NormalChallenges.clearCompletions();
  if (!PelleUpgrade.keepInfinityChallenges.canBeApplied) InfinityChallenges.clearCompletions();
  if (!isReality && EternityMilestone.keepAutobuyers.isReached || Pelle.isDoomed) {
    NormalChallenges.completeAll();
  }
  if (Achievement(133).isUnlocked && !Pelle.isDoomed) InfinityChallenges.completeAll();
  player.challenge.normal.current = 0;
  player.challenge.infinity.current = 0;
}

export function initializeResourcesAfterEternity() {
  player.sacrificed = DC.D0;
  Currency.infinities.reset();
  player.records.bestInfinity.time = DC.BEMAX;
  player.records.bestInfinity.realTime = DC.BEMAX;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = DC.D0;
  player.dimensionBoosts = (EternityMilestone.keepInfinityUpgrades.isReached) ? DC.D4 : DC.D0;
  player.galaxies = (EternityMilestone.keepInfinityUpgrades.isReached) ? DC.D1 : DC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.IPMultPurchases = DC.D0;
  Currency.infinityPower.reset();
  Currency.timeShards.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = DC.D0;
  player.totalTickGained = DC.D0;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Player.resetRequirements("eternity");
}

export function applyEU1() {
  if (player.eternityUpgrades.size < 3 && Perk.autounlockEU1.canBeApplied) {
    for (const id of [1, 2, 3]) player.eternityUpgrades.add(id);
  }
}

// We want this to be checked before any EP-related autobuyers trigger, but we need to call this from the autobuyer
// code since those run asynchronously from gameLoop
export function applyEU2() {
  if (player.eternityUpgrades.size < 6 && Perk.autounlockEU2.canBeApplied) {
    const secondRow = EternityUpgrade.all.filter(u => u.id > 3);
    for (const upgrade of secondRow) {
      if (player.eternityPoints.gte(upgrade.cost / 1e10)) player.eternityUpgrades.add(upgrade.id);
    }
  }
}

function askEternityConfirmation() {
  if (player.dilation.active && player.options.confirmations.dilation) {
    Modal.exitDilation.show();
  } else if (player.options.confirmations.eternity) {
    Modal.eternity.show();
  } else {
    animateAndEternity();
  }
}

export function gainedEternities() {
  return Pelle.isDisabled("eternityMults")
    ? new Decimal(1)
    : new Decimal(getAdjustedGlyphEffect("timeetermult"))
      .timesEffectsOf(RealityUpgrade(3), Achievement(113))
      .pow(AlchemyResource.eternity.effectValue);
}

export class EternityMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    if (Pelle.isDoomed && this.config.givenByPelle) {
      return this.config.givenByPelle();
    }
    return Currency.eternities.gte(this.config.eternities);
  }
}
export const EternityMilestone = mapGameDataToObject(
  GameDatabase.eternity.milestones,
  config => (config.isBaseResource
    ? new EternityMilestoneState(config)
    : new EternityMilestoneState(config))
);

class EternityUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.eternityPoints;
  }

  get set() {
    return player.eternityUpgrades;
  }
}

class EPMultiplierState extends GameMechanicState {
  constructor() {
    super({});
    this.cachedCost = new Lazy(() => this.costAfterCount(player.epmultUpgrades));
    this.cachedEffectValue = new Lazy(() => DC.D15.pow(player.epmultUpgrades));
  }

  get isAffordable() {
    return !Pelle.isDoomed && Currency.eternityPoints.gte(this.cost);
  }

  get cost() {
    return this.cachedCost.value;
  }

  get boughtAmount() {
    return player.epmultUpgrades;
  }

  set boughtAmount(value) {
    // Reality resets will make this bump amount negative, causing it to visually appear as 0 even when it isn't.
    // A dev migration fixes bad autobuyer states and this change ensures it doesn't happen again
    const diff = Decimal.max(value.sub(player.epmultUpgrades), 0);
    player.epmultUpgrades = value;
    this.cachedCost.invalidate();
    this.cachedEffectValue.invalidate();
    Autobuyer.eternity.bumpAmount(DC.D5.pow(diff));
  }

  get isCustomEffect() {
    return true;
  }

  get effectValue() {
    return this.cachedEffectValue.value;
  }

  purchase() {
    if (!this.isAffordable) return false;
    Currency.eternityPoints.subtract(this.cost);
    this.boughtAmount = this.boughtAmount.add(1);
    return true;
  }

  // eslint-disable-next-line consistent-return
  costInv() {
    let tempVal = DC.D0;
    let bulk = DC.D1;
    let cur = Currency.eternityPoints.value.max(1);
    if (cur.gt(this.costIncreaseThresholds[3])) {
      cur = Decimal.log(cur.div(500), 1e3);
      return cur.add(Math.pow(1332, 1.2)).root(1.2).floor().max(1332);
      // eslint-disable-next-line no-else-return
    }
    if (cur.gt(this.costIncreaseThresholds[2])) {
      bulk = this.costIncreaseThresholds[2].div(500).log(500).floor();
      tempVal = (DC.E3).pow(bulk).times(500);
      cur = cur.div(tempVal).max(1 / 1e3);
      return bulk.add(cur.log(1e3).add(1)).floor();
    }
    if (cur.gt(this.costIncreaseThresholds[1])) {
      bulk = this.costIncreaseThresholds[1].div(500).log(100).floor();
      tempVal = (DC.E2.times(5)).pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 500));
      return bulk.add(cur.log(500).add(1)).floor();
    }
    if (cur.gt(this.costIncreaseThresholds[0])) {
      bulk = this.costIncreaseThresholds[0].div(500).log(50).floor();
      tempVal = DC.E2.pow(bulk).times(500);
      cur = cur.div(tempVal.max(1 / 100));
      return bulk.add(cur.log(100).add(1)).floor();
    }
    return cur.div(500).max(1 / 50).log(50).add(1).floor();
  }

  buyMax(auto) {
    if (!this.isAffordable) return false;
    if (RealityUpgrade(15).isLockingMechanics) {
      if (!auto) RealityUpgrade(15).tryShowWarningModal();
      return false;
    }


    // Technically inaccurate, but it works fine (is it inaccurate tho???)
    // Should probably use hardcoded values but im lazy so no

    let bulk = Decimal.floor(this.costInv());
    if (bulk.lt(1)) return false;
    const price = this.costAfterCount(bulk.sub(1));
    bulk = bulk.sub(this.boughtAmount).max(0);

    if (bulk.eq(0)) return false;
    Currency.eternityPoints.subtract(price);
    this.boughtAmount = this.boughtAmount.add(bulk);
    let i = 0;
    while (Currency.eternityPoints.gt(this.costAfterCount(this.boughtAmount)) &&
    i < 50 && this.boughtAmount.layer < 1) {
      this.boughtAmount = this.boughtAmount.add(1);
      Currency.eternityPoints.subtract(this.costAfterCount(this.boughtAmount.sub(1)));
      i += 1;
    }
    return true;
  }

  reset() {
    this.boughtAmount = DC.D0;
  }

  get costIncreaseThresholds() {
    return [DC.E100, DC.NUMMAX, DC.E1300, DC.E4000];
  }

  costAfterCount(count) {
    const costThresholds = EternityUpgrade.epMult.costIncreaseThresholds;
    const multPerUpgrade = [50, 100, 500, 1000];
    for (let i = 0; i < costThresholds.length; i++) {
      const cost = Decimal.pow(multPerUpgrade[i], count).times(500);
      if (cost.lt(costThresholds[i])) return cost;
    }
    // This formula is slightly weaker than base AD but who gives a fuck
    return DC.E3.pow(count.pow(1.2).sub(Math.pow(1332, 1.2))).times(500);
  }
}

export const EternityUpgrade = mapGameDataToObject(
  GameDatabase.eternity.upgrades,
  config => new EternityUpgradeState(config)
);

EternityUpgrade.epMult = new EPMultiplierState();
