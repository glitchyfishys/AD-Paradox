export class PlayerProgress {
  constructor(player) {
    this._player = player;
  }

  get isInfinityUnlocked() {
    return new Decimal(this._player.infinities).gt(0) || this.isEternityUnlocked;
  }

  get isEternityUnlocked() {
    return new Decimal(this._player.eternities).gt(0) || this.isAbsurdityUnlocked;
  }

  get isAbsurdityUnlocked() {
    return new Decimal(this._player.absurdity.absurdities).gt(0) || this.isRealityUnlocked;
  }

  get isRealityUnlocked() {
    return new Decimal(this._player.realities).gt(0);
  }

  get hasFullCompletion() {
    return this._player.records?.fullGameCompletions > 0;
  }

  static get current() {
    return new PlayerProgress(player);
  }

  static of(player) {
    return new PlayerProgress(player);
  }

  static infinityUnlocked() {
    return PlayerProgress.current.isInfinityUnlocked;
  }

  static hasBroken() {
    return player.break || this.isEternityUnlocked || this.isRealityUnlocked;
  }

  static replicantiUnlocked() {
    return Replicanti.areUnlocked || this.isEternityUnlocked;
  }

  static eternityUnlocked() {
    return PlayerProgress.current.isEternityUnlocked;
  }

  static absurdityUnlocked() {
    return PlayerProgress.current.isAbsurdityUnlocked;
  }

  static dilationUnlocked() {
    return TimeStudy.dilation.isBought;
  }

  static quasmaUnlocked() {
    return TimeStudy(201).isBought || player.absurdity.quasma.active;
  }

  static realityUnlocked() {
    return PlayerProgress.current.isRealityUnlocked;
  }

  static seenAlteredSpeed() {
    const ec13 = EternityChallenge(13);
    return this.realityUnlocked() || ec13.completions > 0 || ec13.isRunning;
  }

  static challengeCompleted() {
    return NormalChallenges.all.slice(1).some(c => c.isCompleted);
  }

  static infinityChallengeCompleted() {
    return InfinityChallenges.all.some(c => c.isCompleted);
  }
}
