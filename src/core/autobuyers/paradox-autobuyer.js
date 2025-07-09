import { AutobuyerState } from "./autobuyer";

export class ParadoxAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.paradox;
  }

  get name() {
    return `Paradox`;
  }

  get isUnlocked() {
    return EternityMilestone.bigCrunchModes.isReached;
  }

  get baseInterval() {
    return 0;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return true
  }

  get amount() {
    return this.data.amount;
  }

  // This is unused mechanically, but should be zero to suppress the "Current bulk:" text
  get bulk() {
    return 0;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xHighest() {
    return this.data.xHighest;
  }

  set xHighest(value) {
    this.data.xHighest = value;
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  get canTick() {
    return Player.canParadox && super.canTick;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get highestPrevPrestige() {
    return Currency.paradoxPower.value;
  }

  get willReset() {

    switch (this.mode) {
      case AUTO_CRUNCH_MODE.AMOUNT:
        return gainedParadoxPower().gte(this.amount);
      case AUTO_CRUNCH_MODE.X_HIGHEST:
      default:
        return gainedParadoxPower().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    if (this.willReset) paradoxResetRequest(true);
  }

}
