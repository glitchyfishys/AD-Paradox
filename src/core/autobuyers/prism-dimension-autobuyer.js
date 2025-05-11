import { IntervaledAutobuyerState } from "./autobuyer";

export class PrismDimensionAutobuyerState extends IntervaledAutobuyerState {
  get tier() {
    return this.id;
  }

  get dimension() {
    return PrismDimension(this.tier);
  }

  get name() {
    return this.dimension.shortDisplayName;
  }

  get fullName() {
    return `${this.name} Prism Dimension`;
  }

  get data() {
    return player.auto.prismDims.all[this.tier - 1];
  }

  get interval() {
    return 1000 * Perk.autobuyerFasterID.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return EternityMilestone[`autobuyerID${this.tier}`].isReached || PelleUpgrade.IDAutobuyers.canBeApplied;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.ETERNITY;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  get canTick() {
    return PrismDimensions.canAutobuy() && this.dimension.isAvailableForPurchase && super.canTick;
  }

  tick() {
    super.tick();
    this.dimension.buyMax(true);
  }

  static get entryCount() { return 8; }
  static get autobuyerGroupName() { return "Prism Dimension"; }
  static get isActive() { return player.auto.prismDims.isActive; }
  static set isActive(value) { player.auto.prismDims.isActive = value; }
}
