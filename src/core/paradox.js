import { DC } from "./constants";
import { softReset } from "./dimboost";

export function manualParadoxResetRequest() {
  if (!Player.canParadox) return;
  if (GameEnd.creditsEverClosed) return;

  if (player.options.confirmations.paradox) {
    Modal.paradox.show();
  } else {
    paradoxResetRequest();
  }
}

export function paradoxResetRequest() {
  if (!Player.canParadox) return;
  paradoxReset();
}

export function paradoxReset( forced = false) {
  if (!forced && !Player.canParadox) return;

  if (Player.canParadox) {
    EventHub.dispatch(GAME_EVENT.PARADOX_BEFORE);
    paradoxGiveRewards();
  }

  paradox();
  EventHub.dispatch(GAME_EVENT.PARADOX_AFTER);
}

function paradoxGiveRewards() {
  Currency.paradoxPower.add(gainedParadoxPower());
}

function paradox() {
  player.galaxies = DC.D0;
  player.dimensionBoosts = DC.D0;
  AntimatterDimensions.reset();
  Currency.antimatter.reset();
  softReset(0);
}

export function gainedParadoxPower(){
  let PP = Decimal.max(AntimatterDimension(1).totalAmount.add(10).log10().sub(9), DC.D1);
  if (PP.gt(308)) {
    PP = PP.mul(Decimal.pow10(AntimatterDimension(1).totalAmount.max(1).log10().div(308).sub(1)));
  }
  if(ParadoxAchievement(21).isUnlocked) PP = PP.mul(2);
  PP = PP.mul(Currency.prismEnergy.value.pow(PrismDimensions.conversionRate).max(1));
  
  PP = PP.timesEffectsOf(
    PrismUpgrade.AD8BoostPP_1,
  )

  PP = PP.pow(AbsurdityUpgrade.PPGain.effectOrDefault(1));

  if(PP.gt('e2000')) PP = PP.div(PP.div('e2000').pow(0.94));

  return PP;
}
