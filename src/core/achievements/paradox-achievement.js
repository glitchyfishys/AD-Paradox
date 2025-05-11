import { DC } from "../constants";
import { GameMechanicState } from "../game-mechanics";

class AchievementState extends GameMechanicState {
  constructor(config) {
    super(config);
    this._row = Math.floor(this.id / 10);
    this._column = this.id % 10;
    this._bitmask = 1 << (this.column - 1);
    this._inverseBitmask = ~this._bitmask;
    this.registerEvents(config.checkEvent, args => this.tryUnlock(args));
  }

  get name() {
    return this.config.name;
  }

  get row() {
    return this._row;
  }

  get column() {
    return this._column;
  }

  get isPreReality() {
    return this.row < 14;
  }

  get isPrePelle() {
    return this.row < 18;
  }

  get isUnlocked() {
    return (player.paradox.achievementBits[this.row - 1] & this._bitmask) !== 0;
  }

  get isDisabled() {
    return Pelle.isDisabled("achievements") && Pelle.disabledAchievements.includes(this.id);
  }

  get isEffectActive() {
    return this.isUnlocked && !this.isDisabled;
  }

  tryUnlock(args) {
    if (this.isUnlocked) return;
    if (!this.config.checkRequirement(args)) return;
    this.unlock();
  }

  lock() {
    player.achievementBits[this.row - 1] &= this._inverseBitmask;
  }

  unlock() {
    if (this.isUnlocked) return;
    player.paradox.achievementBits[this.row - 1] |= this._bitmask;
    GameUI.notify.success(`Paradox Achievement: ${this.name}`);
    EventHub.dispatch(GAME_EVENT.PARADOX_ACHIEVEMENT_UNLOCKED);
  }
}

/**
 * @param {number} id
 * @returns {ParadoxAchievementState}
 */
export const ParadoxAchievement = AchievementState.createAccessor(GameDatabase.achievements.paradox);

export const ParadoxAchievements = {
  /**
   * @type {AchievementState[]}
   */
  all: ParadoxAchievement.index.compact(),

  /**
   * @type {ParadoxAchievementState[]}
   */
  get prePelle() {
    return ParadoxAchievements.all.filter(ach => ach.isPrePelle);
  },

  get allRows() {
    const count = ParadoxAchievements.all.map(a => a.row).nMax();
    return ParadoxAchievements.rows(1, count);
  },

  get prePelleRows() {
    const count = ParadoxAchievements.prePelle.map(a => a.row).nMax();
    return ParadoxAchievements.rows(1, count);
  },

  rows: (start, count) => Array.range(start, count).map(ParadoxAchievements.row),

  row: row => Array.range(row * 10 + 1, 8).map(ParadoxAchievement),

  get effectiveCount() {
    const unlockedAchievements = ParadoxAchievements.all.countWhere(a => a.isUnlocked);
    return unlockedAchievements;
  },

};
