import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";

class ChargedParadoxUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

export class ParadoxUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedParadoxUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.paradoxPower;
  }

  get set() {
    return player.paradox.upgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      EventHub.dispatch(GAME_EVENT.PARADOX_UPGRADE_BOUGHT)
      return true;
    }
    if (this.canCharge) {
      this.charge();
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined;
  }

  get isCharged() {
    return player.paradox.charged.has(this.id);
  }

  get canCharge() {
    return this.isBought &&
      this.hasChargeEffect &&
      !this.isCharged &&
      Ra.chargesLeft !== 0 &&
      !Pelle.isDisabled("chargedInfinityUpgrades");
  }

  charge() {
    player.paradox.charged.add(this.id);
  }

  disCharge() {
    player.paradox.charged.delete(this.id);
  }
}

export const ParadoxUpgrade = mapGameDataToObject(
  GameDatabase.paradox.paradoxUpgrades,
  config => new ParadoxUpgradeState(config)
);

export class PrismUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
  }

  get currency() {
    return Currency.prismEnergy;
  }

  get set() {
    return player.paradox.prismUpgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (super.purchase()) {
      EventHub.dispatch(GAME_EVENT.PARADOX_UPGRADE_BOUGHT)
      return true;
    }
    return false;
  }

}

export const PrismUpgrade = mapGameDataToObject(
  GameDatabase.paradox.prismUpgrades,
  config => new PrismUpgradeState(config)
);