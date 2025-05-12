/* eslint-disable max-len */
import { DC } from "../../constants";

export const paradoxAchievements = [
  {
    id: 11,
    name: "It's a Paradox",
    description: "Cause a Paradox.",
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.PARADOX_BEFORE,
  },
  {
    id: 12,
    name: "Powerful Paradoxes",
    get description() {return `Have ${format(10)} Paradox Power.`},
    checkRequirement: () => Currency.paradoxPower.gte(10),
    checkEvent: GAME_EVENT.PARADOX_AFTER,
  },
  {
    id: 13,
    name: "Five of a kind",
    get description() {return `Have ${format(5)} Paradox Upgrades.`},
    checkRequirement: () => player.paradox.upgrades.size > 4,
    checkEvent: GAME_EVENT.PARADOX_UPGRADE_BOUGHT,
  },
  {
    id: 14,
    name: "Bad Upgrades",
    get description() {return `Have ${format(10)} Paradox Upgrades.`},
    checkRequirement: () => player.paradox.upgrades.size > 9,
    checkEvent: GAME_EVENT.PARADOX_UPGRADE_BOUGHT,
  },
  {
    id: 15,
    name: "5 more Paradoxes until the update",
    description: 'Have all Paradox Upgrades.',
    checkRequirement: () => player.paradox.upgrades.size > 14,
    checkEvent: GAME_EVENT.PARADOX_UPGRADE_BOUGHT,
  },
  {
    id: 16,
    name: "We could afford 99 but not 9",
    get description() {return `Have ${format(100)} Paradox Power.`},
    checkRequirement: () => Currency.paradoxPower.gte(100),
    checkEvent: GAME_EVENT.PARADOX_AFTER,
  },
  {
    id: 17,
    name: "Wait what?",
    get description() {return `Reach the ${format(1e200)} Antimatter softcap.`},
    checkRequirement: () => Currency.antimatter.gte(1e200),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 18,
    name: "A lot of Galaxies",
    get description() { return "Have 10 Antimatter Galaxies."; },
    checkRequirement: () => player.galaxies.gte(10),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    reward: "Antimatter Dimension and Tickspeed don't cost Antimatter"
  },
  {
    id: 21,
    name: "Infinitly upgraded",
    get description() { return "Buy an Infinity upgrade."; },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
    reward: "Double PP gain"
  },
  {
    id: 22,
    name: "Idle gameplay",
    get description() { return "Buy the IP gen Infinity upgrade."; },
    checkRequirement: () => InfinityUpgrade.ipGen.isBought,
    checkEvent: GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
  },
  {
    id: 23,
    name: "That was challenging",
    get description() { return "Complete a Normal challenge."; },
    checkRequirement: () => {let x = 0; NormalChallenges.all.forEach(c => c.isCompleted ? x++ : false); return x > 1},
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    reward: "Keep the first row of paradox upgrades on Infinity"
  },
  {
    id: 24,
    name: "A new Dimension?",
    get description() { return "Buy a Prism Dimension."; },
    checkRequirement: () => Currency.prismEnergy.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 25,
    name: "Subtle foreshadowing",
    get description() { return "Complete 4 Infinity Challenges."; },
    checkRequirement: () => InfinityChallenges.completed.length > 3,
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
  },
  {
    id: 26,
    name: "Double it",
    get description() { return "Unlock Replicanti"; },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER,
  },
  {
    id: 27,
    name: "A new Galaxy",
    get description() { return "Get a Replicanti Galaxy"; },
    checkRequirement: () => player.replicanti.galaxies.gte(1),
    checkEvent: GAME_EVENT.PARADOX_AFTER,
  },
  {
    id: 28,
    name: "THIS WAS MADE BY THE VIS DEV?!?",
    get description() { return "Vis reference here (No, you can't get this. and there is NO Eternity)"; },
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.PARADOX_AFTER,
  },
];
