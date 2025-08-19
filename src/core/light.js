import { GameMechanicState } from "./game-mechanics";

class LightState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get color() {
    return this.config.color;
  }

  get gain() {
    return this.config.gain.pow(getAdjustedGlyphEffect('prismlightpow'));
  }

   get lockedDescription() {
    return this.config.lockedDescription();
  }

  unlock(){
    if(this.config.unlocked()) player.paradox.prism.unlockBits |= 1 << this.config.slotID;
  }

  get isUnlocked() {
    return (player.paradox.prism.unlockBits & (1 << this.config.slotID)) > 0;
  }

  get isPrimary() {
    return this.color == 'green' || this.color == 'blue' || this.color == 'red'
  }

  split() {
    Currency.light[this.color] = 
    Currency.light[this.color].add(this.gain);
    if(this.isPrimary) {
      PrismDimensions.resetAmount();
    } else {
      if (this.color == 'purple'){
        Currency.light.red = new Decimal(0);
        Currency.light.blue = new Decimal(0);
      }
      else if (this.color == 'yellow'){
        Currency.light.red = new Decimal(0);
        Currency.light.green = new Decimal(0);
      }
      else if (this.color == 'cyan'){
        Currency.light.green = new Decimal(0);
        Currency.light.blue = new Decimal(0);
      }
      else console.warn('You messed up with colors'); 
    }
  
  }

  get isEffectActive() {
    return this.isUnlocked;
  }
}

export const Light = mapGameDataToObject(
  GameDatabase.paradox.lightEffects,
  config => new LightState(config)
);
