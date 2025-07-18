import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";

export function bigCrunchAnimation() {
  FullScreenAnimationHandler.display("a-implode", 2);
}

function handleChallengeCompletion() {
  const challenge = Player.antimatterChallenge;
  if (!challenge && !NormalChallenge(1).isCompleted) {
    NormalChallenge(1).complete();
  }
  if (!challenge) return;

  // Clear the IC notification after the first completion (only) so that it can show it again for the next one
  const inIC = InfinityChallenge.isRunning;
  if (inIC && !InfinityChallenge.current.isCompleted) TabNotification.ICUnlock.clearTrigger();

  challenge.complete();
  challenge.updateChallengeTime();
  if (!player.options.retryChallenge) {
    player.challenge.normal.current = 0;
    player.challenge.infinity.current = 0;
  }
}

export function manualBigCrunchResetRequest() {
  if (!Player.canCrunch) return;
  if (GameEnd.creditsEverClosed) return;
  // We show the modal under two conditions - on the first ever infinity (to explain the mechanic) and
  // post-break (to show total IP and infinities gained)
  if (player.options.confirmations.bigCrunch && (!PlayerProgress.infinityUnlocked() || player.break)) {
    Modal.bigCrunch.show();
  } else {
    bigCrunchResetRequest();
  }
}

export function bigCrunchResetRequest(disableAnimation = false) {
  if (!Player.canCrunch) return;
  if (!disableAnimation && player.options.animations.bigCrunch && !FullScreenAnimationHandler.isDisplaying) {
    bigCrunchAnimation();
    setTimeout(bigCrunchReset, 1000);
  } else {
    bigCrunchReset();
  }
}

export function bigCrunchReset(
  forced = false,
  enteringAntimatterChallenge = Player.isInAntimatterChallenge && player.options.retryChallenge
) {
  if (!forced && !Player.canCrunch) return;

  if (Player.canCrunch) {
    EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_BEFORE);
    bigCrunchGiveRewards();
    if (Pelle.isDoomed) PelleStrikes.infinity.trigger();
  }

  bigCrunchResetValues(enteringAntimatterChallenge);
  EventHub.dispatch(GAME_EVENT.BIG_CRUNCH_AFTER);
}

function bigCrunchGiveRewards() {
  bigCrunchUpdateStatistics();

  Currency.paradoxPower.add(gainedParadoxPower());
  
  const infinityPoints = gainedInfinityPoints();
  Currency.infinityPoints.add(infinityPoints);
  Currency.infinities.add(gainedInfinities().round());

  bigCrunchTabChange(!PlayerProgress.infinityUnlocked());
  bigCrunchCheckUnlocks();
}

function bigCrunchUpdateStatistics() {
  player.records.bestInfinity.bestIPminEternity =
    player.records.bestInfinity.bestIPminEternity.clampMin(player.records.thisInfinity.bestIPmin);
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.records.bestInfinity.trueTime = Math.min(player.records.bestInfinity.trueTime, player.records.thisInfinity.trueTime)

  player.records.thisEternity.bestInfinitiesPerMs = player.records.thisEternity.bestInfinitiesPerMs.clampMin(
    gainedInfinities().round().dividedBy(Decimal.clampMin(33, player.records.thisInfinity.realTime))
  );

  const infinityPoints = gainedInfinityPoints();

  addInfinityTime(
    player.records.thisInfinity.trueTime,
    player.records.thisInfinity.time,
    player.records.thisInfinity.realTime,
    infinityPoints,
    gainedInfinities().round()
  );

  player.records.bestInfinity.time =
  Decimal.min(player.records.bestInfinity.time, player.records.thisInfinity.time);
  player.records.bestInfinity.realTime =
    Decimal.min(player.records.bestInfinity.realTime, player.records.thisInfinity.realTime);

  player.requirementChecks.reality.noInfinities = false;

  if (!player.requirementChecks.infinity.maxAll) {
    const bestIpPerMsWithoutMaxAll = infinityPoints.dividedBy(
      Decimal.clampMin(33, player.records.thisInfinity.realTime));
    player.records.thisEternity.bestIPMsWithoutMaxAll =
      Decimal.max(bestIpPerMsWithoutMaxAll, player.records.thisEternity.bestIPMsWithoutMaxAll);
  }
}

function bigCrunchTabChange(firstInfinity) {
  const earlyGame = player.records.bestInfinity.time.gt(60000) && !player.break;
  const inAntimatterChallenge = Player.isInAntimatterChallenge;
  handleChallengeCompletion();

  if (firstInfinity) {
    Tab.infinity.upgrades.show();
  } else if (earlyGame || (inAntimatterChallenge && !player.options.retryChallenge)) {
    Tab.dimensions.antimatter.show();
  }
}

export function bigCrunchResetValues(enteringAntimatterChallenge) {
  const currentReplicanti = Replicanti.amount;
  const currentReplicantiGalaxies = player.replicanti.galaxies;
  // For unknown reasons, everything but keeping of RGs (including resetting of RGs)
  // is done in the function called below. For now, we're just trying to keep
  // code structure similar to what it was before to avoid new bugs.
  secondSoftReset(enteringAntimatterChallenge);

  let remainingGalaxies = DC.D0;
  if (Achievement(95).isUnlocked && !Pelle.isDoomed) {
    Replicanti.amount = currentReplicanti;
    remainingGalaxies = remainingGalaxies.add(Decimal.min(currentReplicantiGalaxies, 1));
  }
  if (TimeStudy(33).isBought && !Pelle.isDoomed) {
    remainingGalaxies = remainingGalaxies.add(Decimal.floor(currentReplicantiGalaxies.div(2)));
  }

  if (PelleUpgrade.replicantiGalaxyNoReset.canBeApplied) {
    remainingGalaxies = currentReplicantiGalaxies;
  }
  // I don't think this Math.clampMax is technically needed, but if we add another source
  // of keeping Replicanti Galaxies then it might be.
  player.replicanti.galaxies = Decimal.clampMax(remainingGalaxies, currentReplicantiGalaxies);
}

function bigCrunchCheckUnlocks() {
  if (EternityChallenge(5).tryFail()) return;

  if (Effarig.isRunning && !EffarigUnlock.infinity.isUnlocked) {
    EffarigUnlock.infinity.unlock();
    beginProcessReality(getRealityProps(true));
  }
}

export function secondSoftReset(enteringAntimatterChallenge) {
  player.dimensionBoosts = DC.D0;
  player.galaxies = DC.D0;
  player.records.thisInfinity.maxAM = DC.D0;
  Currency.antimatter.reset();
  softReset(0, true, true, enteringAntimatterChallenge);
  InfinityDimensions.resetAmount();
  if (player.replicanti.unl) Replicanti.amount = DC.D1;
  player.replicanti.galaxies = DC.D0;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = DC.D0;
  Player.resetRequirements("infinity");
  AchievementTimers.marathon2.reset();
  
  if (!PrismUpgrade.KeepRow2_1.isEffectActive) {
    player.paradox.upgrades.clear();
    if (ParadoxAchievement(23).isEffectActive) player.paradox.upgrades = new Set(["ADbuy10_1", "BaseAD_1", "Dimboost_1", "Tickspeed_1", "Ach_1"]);
  }
  
  if(!PrismUpgrade.KeepPP_1.isEffectActive) Currency.paradoxPower.reset();
}

export function preProductionGenerateIP(diff) {
  if (InfinityUpgrade.ipGen.isBought) {
    const genPeriod = Time.bestInfinity.totalMilliseconds.clampMin(1e-100);
    let genCount;
    if (diff.gte(1e100)) {
      genCount = Decimal.div(diff, genPeriod);
    } else {
      // Partial progress (fractions from 0 to 1) are stored in player.partInfinityPoint
      const idk = diff.toNumber();
      player.partInfinityPoint += idk / genPeriod.clampMax(1e300).toNumber();
      genCount = Decimal.floor(player.partInfinityPoint);
      player.partInfinityPoint -= genCount.toNumber();
    }
    let gainedPerGen = player.records.bestInfinity.time.gte(DC.BEMAX) ? DC.D0 : InfinityUpgrade.ipGen.effectValue;
    if (Laitela.isRunning) gainedPerGen = dilatedValueOf(gainedPerGen);
    const gainedThisTick = genCount.times(gainedPerGen);
    Currency.infinityPoints.add(gainedThisTick);
  }
  Currency.infinityPoints.add(BreakInfinityUpgrade.ipGen.effectOrDefault(DC.D0).times(diff.div(60000)));
}
