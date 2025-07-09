import { DC } from "../../constants";

export const infinityChallenges = [
  {
    id: 1,
    description: `all Normal Challenge restrictions are active at once, with the exception of the
      Tickspeed (C9) and Big Crunch (C12) Challenges.`,
    goal: DC.E650,
    isQuickResettable: true,
    reward: {
      description: () => `${formatPow(1.1, 1, 1)} on all Infinity Dimensions for each Infinity Challenge completed`,
      effect: () => Math.pow(1.1, InfinityChallenges.completed.length),
      formatEffect: value => formatPow(value, 1, 1)
    },
    unlockAM: DC.E2000,
  },
  {
    id: 2,
    description: () => `Dimensional Sacrifice happens automatically every ${formatInt(400)} milliseconds once you have
      an 8th Antimatter Dimension.`,
    goal: DC.E6000,
    isQuickResettable: false,
    reward: {
      description: () => `Dimensional Sacrifice autobuyer and stronger Dimensional Sacrifice
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": false })} ➜
        ${Sacrifice.getSacrificeDescription({ "InfinityChallenge2isCompleted": true })}`,
    },
    unlockAM: DC.E6000,
  },
  {
    id: 3,
    description: () =>
      `Tickspeed upgrades are always ${formatX(1)}. For every Tickspeed upgrade purchase, you instead get a static
      multiplier on all Antimatter Dimensions which increases based on Antimatter Galaxies.`,
    goal: DC.E3000,
    isQuickResettable: false,
    effect: () => Decimal.pow(player.galaxies.times(0.1).add(1.25), player.totalTickBought),
    formatEffect: value => formatX(value, 2, 2),
    reward: {
      description: `Antimatter Dimension multiplier based on Antimatter Galaxies and Tickspeed purchases`,
      effect: () => (Laitela.continuumActive
        ? Decimal.pow(player.galaxies.times(0.1).add(1.25), Tickspeed.continuumValue)
        : Decimal.pow(player.galaxies.times(0.1).add(1.25), player.totalTickBought)),
      formatEffect: value => formatX(value, 2, 2),
    },
    unlockAM: DC.E6800,
  },
  {
    id: 4,
    description: () =>
      `only the latest bought Antimatter Dimension's production is normal. All other Antimatter Dimensions
      produce less (${formatPow(0.05, 2, 2)}).`,
    goal: DC.E9000,
    isQuickResettable: true,
    effect: 0.05,
    reward: {
      description: () => `All Antimatter Dimension multipliers become multiplier${formatPow(1.15, 2, 2)}`,
      effect: 1.15
    },
    unlockAM: DC.E9250,
  },
  {
    id: 5,
    description:
      `buying Antimatter Dimensions 1-4 causes all cheaper AD costs to increase.
      Buying Antimatter Dimensions 5-8 causes all more expensive AD costs to increase.`,
    goal: DC.E10500,
    isQuickResettable: true,
    reward: {
      description: () =>
        `All Galaxies are ${formatPercents(0.2)} stronger and reduce the requirements for them
        and Dimension Boosts by ${formatInt(1)}`,
      effect: 1.2
    },
    unlockAM: DC.E11500,
  },
  {
    id: 6,
    description: () =>
      `exponentially rising matter divides the multiplier on all of your Antimatter Dimensions
      once you have at least ${formatInt(1)} 2nd Antimatter Dimension.`,
    goal: DC.E14444,
    isQuickResettable: true,
    effect: () => Currency.matter.value.clampMin(1),
    formatEffect: value => `/${format(value, 1, 2)}`,
    reward: {
      description: "Infinity Dimension multiplier based on tickspeed",
      effect: () => Tickspeed.perSecond.pow(0.05),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: DC.E14444,
  },
  {
    id: 7,
    description: () => {
      return `you cannot buy Antimatter Galaxies. Base Dimension Boost multiplier is increased to a maximum
        of ${formatX(250)}.`;
    },
    goal: DC.E8000,
    isQuickResettable: false,
    effect: 250,
    reward: {
      description: () => `Dimension Boost multiplier is multiplyed by ${formatX(4)} and Distant AG Scaling starts ${formatInt(10)} Galaxies later`,
      effect: 4
    },
    unlockAM: DC.E18000,
  },
  {
    id: 8,
    description: () =>
      `AD production rapidly and continually drops over time. Purchasing Antimatter Dimension or Tickspeed
        upgrades sets production back to ${formatPercents(1)} before it starts dropping again.`,
    goal: DC.E26000,
    isQuickResettable: true,
    effect: () => DC.D0_8446303389034288.pow(
      Decimal.max(0, player.records.thisInfinity.time.sub(player.records.thisInfinity.lastBuyTime))),
    reward: {
      description:
        "You get a multiplier to AD 2-7 based on 1st and 8th AD multipliers.",
      effect: () => AntimatterDimension(1).multiplier.times(AntimatterDimension(8).multiplier).pow(0.1),
      formatEffect: value => formatX(value, 2, 2)
    },
    unlockAM: DC.E26000,
  },
  {
    id: 9,
    description: () =>
      `Only the 1st Animatter dimensions produce anything.`,
    goal: DC.E85000,
    isQuickResettable: false,
    reward: {
      description: "You can pick another path from the Time Study Dimension Split. This does not reset on Eternity",
      effect: () => 1,
    },
    unlockAM: DC.E1E6,
  },
];
