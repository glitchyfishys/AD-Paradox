import { IntervaledAutobuyerState } from "./autobuyer";

export class QuasmaUpgradeAutobuyerState extends IntervaledAutobuyerState {
  get _upgradeName() { return ["chromaticGain", "galaxyStrength", "nitronicGain",
    "ADMul", "IDMul", "TDMul"][this.id - 1]; }

  get data() {
    return player.auto.quasmaUpgrades.all[this.id - 1];
  }

  get name() {
    return [`Chromatic Energy Multiplier`, `Galaxy Strength`, "Nitronic Energy Multiplier",
      "Antimatter Dimension Multiplier", "Infinity Dimension Multiplier", "Time Dimension Multiplier"][this.id - 1];
  }

  get interval() {
    return 2000 * Perk.autobuyerFasterDilation.effectOrDefault(1) / PerkShopUpgrade.autoSpeed.effectOrDefault(1);
  }

  get isUnlocked() {
    return Perk.quasmaUpgradeAuto.isEffectActive && !Pelle.isDoomed;
  }

  get resetTickOn() {
    return PRESTIGE_EVENT.REALITY;
  }

  get bulk() {
    return Effects.product(PerkShopUpgrade.bulkDilation, Perk.dilationAutobuyerBulk);
  }

  tick() {
    super.tick();
    const upgradeName = this._upgradeName;
    QuasmaUpgrade[upgradeName].purchase(this.bulk);
  }

  static get entryCount() { return 6; }
  static get autobuyerGroupName() { return "Quasma Upgrade"; }
  static get isActive() { return player.auto.quasmaUpgrades.isActive; }
  static set isActive(value) { player.auto.quasmaUpgrades.isActive = value; }
}
