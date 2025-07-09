import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";

export class AbsurdityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
  }

  get currency() {
    return Currency.absurdityEnergy;
  }

  get set() {
    return player.absurdity.upgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (super.purchase()) {
      EventHub.dispatch(GAME_EVENT.ABSURDITY_UPGRADE_BOUGHT)
      return true;
    }
    return false;
  }
}

export const AbsurdityUpgrade = mapGameDataToObject(
  GameDatabase.absurdity.absurdityUpgrades,
  config => new AbsurdityUpgradeState(config)
);
