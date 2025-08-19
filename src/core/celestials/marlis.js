import { Quotes } from "./quotes";

export const Marlis = {
  displayName: "Marlis",
  possessiveName: "Marlis's",
  quotes: Quotes.marlis,
  symbol: "貴", // 貴 as a suffix means of high power 
};

EventHub.logic.on(GAME_EVENT.REALITY_RESET_AFTER, () => {
  Marlis.quotes.initial.show();
});
