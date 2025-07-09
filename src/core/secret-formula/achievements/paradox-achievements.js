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
    name: "Infinitely upgraded",
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
    reward: "Keep the first row of paradox upgrades on All Resets"
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
    name: "Green Light",
    description: 'Unlock Red Light',
    checkRequirement: () => Light.ADMul.isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
  },
  {
    id: 31,
    name: "The Best Milestone",
    get description() {return `Reach the Eternity Milestone for ${format(9)} Eternites.`},
    checkRequirement: () => EternityMilestone.autobuyMaxGalaxies.isReached,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
  },
  {
    id: 32,
    name: "That's Absured",
    description: 'Absudity once.',
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ABSURDITY_RESET_AFTER,
  },
  {
    id: 33,
    name: "Almost half way",
    get description() {return `Complete ${format(25)} Eternity Challenges.`},
    description: 'Complete 25 Eternity Challenges.',
    checkRequirement: () => EternityChallenges.completions >= 25,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    get reward() {return `Slightly reduce the ${format('e4000')} IP softcap.`},
  },
  {
    id: 34,
    name: "Did you mean Quasar?",
    description: 'Enter an Absurd Quasma.',
    checkEvent: GAME_EVENT.ACHIEVEMENT_EVENT_OTHER,
  },
  {
    id: 35,
    name: "I love timewalls",
    get description() {return `Have a total of ${format(1000)} nitronic Energy.`},
    checkRequirement: () => Currency.nitronicEnergy.gte(1e3),
    checkEvent: GAME_EVENT.ABSURDITY_RESET_AFTER,
    reward: 'Gain a slight multiplier to Chromatic Energy gain based on antimatter.',
    effect: () => {
      let x = quasmaValueOf(Currency.antimatter.value).log10().div(100).max(1);
      if (x.gt(250)) x = x.mul(x.div(250).pow(1.5));
      return x.min(5e3);
    },
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 36,
    name: "I hate timewalls",
    description: 'Complete EC 12 and 13 Each Once.',
    checkRequirement: () => EternityChallenge(12).completions > 0 && EternityChallenge(13).completions > 0,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    reward: 'Gain a multiplier to Nitric Energy gain based on EC12 and 13 Completions.',
    effect: () => Decimal.mul(EternityChallenge(12).completions, EternityChallenge(13).completions).add(1).max(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 37,
    name: "That took an Eternity",
    description: 'Complete all Eternity Challenges five times.',
    checkRequirement: () => EternityChallenges.completions >= 65,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    get reward() { return `Rebuyable Quasma upgrades scale ${formatPercents(0.15)} less and slightly lower the Quasma penalty.` },
    effect: () => 0.85
  },
  {
    id: 38,
    name: "NYI",
    description: 'Not yet implemented.',
    checkRequirement: () => false,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE,
  },
];
