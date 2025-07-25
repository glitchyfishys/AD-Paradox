import { DC } from "../../../constants";

const thisInfinityMult = thisInfinity => {
  // All "this inf time" or "best inf time" mults are * 10
  const scaledInfinity = thisInfinity.times(10).add(1);
  const cappedInfinity = Decimal.min(Decimal.pow(scaledInfinity, 0.15), 1e5);
  return DC.D15.pow(Decimal.log10(scaledInfinity).times(cappedInfinity).mul(12));
};
const passiveIPMult = () => {
  const isEffarigLimited = Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY;
  const normalValue = Perk.studyPassive.isBought ? 1e200 : 1e100;
  return isEffarigLimited
    ? Math.min(normalValue, Effarig.eternityCap.toNumber())
    : normalValue;
};


/**
 * List of time study specifications and attributes
 * {
 *  @property {Number} id                   Numerical ID shown for each time study in code and in-game
 *  @property {Number} cost                 Amount of available time theorems required to purchase
 *  @property {Number} STcost               Amount of available space theorems required to purchase if needed
 *  @property {Object[]} requirement   Array of Numbers or functions which are checked to determine purchasability
 *  @property {Number} reqType              Number specified by enum in TS_REQUIREMENT_TYPE for requirement behavior
 *  @property {Number[]} requiresST    Array of Numbers indicating which other studies will cause this particular
 *    study to also cost space theorems - in all cases this applies if ANY in the array are bought
 *  @property {function: @return String} description  Text to be shown in-game for the time study's effects
 *  @property {function: @return Number} effect       Numerical value for the effects of a study
 *  @property {String[]} cap     Hard-coded cap for studies which don't scale forever
 *  @property {String} formatEffect   Formatting function for effects, if the default formatting isn't appropriate
 * }
 */
export const normalTimeStudies = [
  {
    id: 11,
    cost: DC.D1,
    // All requirements of an empty array will always evaluate to true, so this study is always purchasable
    requirement: [],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: "Tickspeed affects 1st Time Dimension with reduced effect",
    effect: () => {
      const tickspeed = Tickspeed.current.dividedBy(1000);
      const firstPart = tickspeed.pow(0.005).times(0.95);
      const secondPart = tickspeed.pow(0.0003).times(0.05);
      return firstPart.plus(secondPart).reciprocate();
    },
    cap: DC.E2500,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 21,
    cost: DC.D3,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Improve Replicanti multiplier formula to
      (log2(R)${formatPow(2)})xR${formatPow(0.064, 3, 3)}`,
    effect: () => Replicanti.amount.pow(0.064),
    formatEffect: value => {
      return formatX(value.clampMin(1), 2, 2);
    }
  },
  {
    id: 22,
    cost: DC.D2,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Base Replicanti interval limit ${formatInt(10)}ms ➜ ${formatInt(100)}µs`,
    effect: 0.1
  },
  {
    id: 31,
    cost: DC.D3,
    requirement: [21],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Powers up multipliers that are based on your Infinities (Bonuses${formatPow(8)})`,
    effect: 8
  },
  {
    id: 32,
    cost: DC.D2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: `You gain more Infinities based on Dimension Boosts`,
    effect: () => Decimal.max(DimBoost.totalBoosts, 1),
    formatEffect: value => formatX(value, 2)
  },
  {
    id: 33,
    cost: DC.D2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "You keep half of your Replicanti Galaxies on Infinity"
  },
  {
    id: 41,
    cost: DC.D4,
    requirement: [31],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `All Galaxies give a ${formatX(DC.D1_5, 1, 1)} multiplier to Infinity Points gained`,
    effect: () => DC.D1_5.pow(player.dilation.totalTachyonGalaxies.add(Replicanti.galaxies.total).add(player.galaxies)),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 42,
    cost: new Decimal(6),
    requirement: [32],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Antimatter Galaxy requirement increases by ${formatInt(18)}
      8th Dimensions instead of ${formatInt(20)}`,
    effect: 18
  },
  {
    id: 51,
    cost: DC.D3,
    requirement: [41, 42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain ${formatX(1e30)} more Infinity Points`,
    effect: 1e30
  },
  {
    id: 61,
    cost: DC.D3,
    requirement: [51],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain ${formatX(30)} more Eternity Points`,
    effect: 30
  },
  {
    id: 62,
    cost: DC.D3,
    requirement: [42, () => Perk.bypassEC6Lock.isBought || EternityChallenge(6).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `You gain Replicanti ${formatInt(5)} times faster`,
    effect: 5
  },
  {
    id: 71,
    cost: DC.D4,
    requirement: [61, () => Perk.studyECRequirement.isBought || !EternityChallenge(13).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects all Antimatter Dimensions again with reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.33).clampMin(1),
    cap: DC.E210000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 72,
    cost: new Decimal(5),
    requirement: [61,
      () => Perk.studyECRequirement.isBought ||
        (!EternityChallenge(12).isUnlocked && !EternityChallenge(13).isUnlocked)],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects 2th Prism Dimension with slightly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.07).clampMin(1),
    cap: DC.E30000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 73,
    cost: new Decimal(6),
    requirement: [61,
      () => Perk.studyECRequirement.isBought ||
        (!EternityChallenge(12).isUnlocked && !EternityChallenge(13).isUnlocked)],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects 4th Infinity Dimension with greatly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.05).clampMin(1),
    cap: DC.E30000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 74,
    cost: DC.D5,
    requirement: [61, () => Perk.studyECRequirement.isBought || !EternityChallenge(12).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects 3rd Time Dimension with greatly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.0075).clampMin(1),
    cap: DC.E1500,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 81,
    cost: DC.D4,
    requirement: [71],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Base Dimension Boost power becomes ${formatX(150)}`,
    effect: 150
  },
  {
    id: 82,
    cost: new Decimal(5),
    requirement: [72],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimension Boosts affect Prism Dimensions",
    effect: () => DC.D1_0000109.pow(Decimal.pow(DimBoost.totalBoosts, 2.2)),
    cap: DC.E1E6,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 83,
    cost: new Decimal(6),
    requirement: [73],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimension Boosts affect Infinity Dimensions",
    effect: () => DC.D1_0000109.pow(Decimal.pow(DimBoost.totalBoosts, 2)),
    cap: DC.E1E7,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 84,
    cost: DC.D5,
    requirement: [74],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimension Boost multiplier based on tick upgrades gained from TDs",
    effect: () => Decimal.pow(1.002, player.totalTickGained),
    cap: DC.E30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 91,
    cost: DC.D4,
    requirement: [81],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Antimatter Dimension multiplier based on time spent in this Eternity",
    effect: () => Decimal.pow10(Decimal.min(Time.thisEternity.totalMinutes, 20).times(15)),
    cap: DC.E300,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 92,
    cost: new Decimal(5),
    requirement: [82],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Prism Dimension multiplier based on Eternites",
    effect: () => Currency.eternities.value.pow(0.6).div(2.8).add(1).pow(5),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 93,
    cost: DC.D5,
    requirement: [83],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Infinity Dimension multiplier based on fastest Eternity time",
    effect: () => DC.D2.pow(new Decimal(60).div(Decimal.max(Time.bestEternity.totalSeconds, 2))),
    cap: DC.C2P30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 94,
    cost: new Decimal(7),
    requirement: [84],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Time Dimension multiplier based on tick upgrades gained",
    effect: () => Decimal.pow(player.totalTickGained, 0.25).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 101,
    cost: DC.D4,
    requirement: [91],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Antimatter Dimension multiplier equal to Replicanti amount",
    effect: () => Decimal.max(Replicanti.amount, 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 102,
    cost: DC.D5,
    requirement: [92],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Prism Dimension multiplier based on Replicanti Speed",
    effect: () => totalReplicantiSpeedMult().pow(5),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 103,
    cost: DC.D6,
    requirement: [93],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Replicanti Galaxies boost Replicanti multiplier",
    effect: () => DC.D5.pow(player.replicanti.galaxies),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 104,
    cost: DC.D6,
    requirement: [94],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Time Dimension multiplier equal to Replicanti Galaxy amount",
    effect: () => Decimal.max(player.replicanti.galaxies, 1),
    formatEffect: value => formatX(value, 2, 0)
  },
  {
    id: 111,
    cost: DC.D40,
    requirement: [101, 102, 103, 104],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => (Achievement(103).canBeApplied
      ? `Make the Infinity Point formula better log(x)/${formatFloat(307.2, 1)} ➜ log(x)/${formatInt(250)}`
      : `Make the Infinity Point formula better log(x)/${formatInt(308)} ➜ log(x)/${formatInt(250)}`),
    effect: 250
  },
  {
    id: 112,
    cost: new Decimal(10),
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain ${formatPercents(0.01)} of your Paradox Power gained on Paradox each second`,
    effect: () => gainedParadoxPower().times(Time.deltaTime.div(100))
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige)
  },
  {
    id: 121,
    cost: DC.E1,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [122, 123],
    description: () => (Perk.studyActiveEP.isBought
      ? `You gain ${formatX(500)} more Eternity Points`
      : `You gain more EP based on how fast your last ten Eternities
      were${PlayerProgress.realityUnlocked() ? " (real time)" : ""}`),
    effect: () => (Perk.studyActiveEP.isBought
      ? new Decimal(500)
      : new Decimal(250).div(Player.averageRealTimePerEternity).min(500).max(1)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 1, 1)),
    cap: 500
  },
  {
    id: 122,
    cost: DC.E1,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 123],
    description: () => (Perk.studyPassive.isBought
      ? `You gain ${formatX(500)} more Eternity Points`
      : `You gain ${formatX(50)} more Eternity Points`),
    effect: () => (Perk.studyPassive.isBought ? 500 : 50)
  },
  {
    id: 123,
    cost: DC.E1,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 122],
    description: "You gain more Eternity Points based on time spent this Eternity",
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisEternity.plus(perkEffect).totalSeconds;
      return Decimal.pow(totalSeconds.times(1.4), 0.85);
    },
    formatEffect: value => formatX(value, 1, 1)
  },
  {
    id: 131,
    cost: DC.D5,
    STCost: 8,
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [132, 133],
    description: () => (Achievement(138).isUnlocked
      ? `You can get ${formatPercents(AbsurdityUpgrade.RGCap.isBought ? 0.6 : 0.5)} more Replicanti Galaxies`
      : `Automatic Replicanti Galaxies are disabled, but you can get ${formatPercents(AbsurdityUpgrade.RGCap.isBought ? 0.6 : 0.5)} more`),
    effect: () => Decimal.floor(player.replicanti.boughtGalaxyCap.mul(AbsurdityUpgrade.RGCap.isBought ? 0.6 : 0.5))
  },
  {
    id: 132,
    cost: DC.D5,
    STCost: 8,
    requirement: [122],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 133],
    description: () => (Pelle.isDoomed
      ? `Replicanti Galaxies are ${formatPercents(formatPercents(AbsurdityUpgrade.RGCap.isBought ? 0.5 : 0.4))} stronger`
      : `Replicanti Galaxies are ${formatPercents(AbsurdityUpgrade.RGCap.isBought ? 0.5 : 0.4)} stronger and Replicanti are 
        ${Perk.studyPassive.isBought ? formatX(3) : formatX(1.5, 1, 1)} faster`),
    effect: () => AbsurdityUpgrade.RGCap.isBought ? 0.5 : 0.4
  },
  {
    id: 133,
    cost: DC.D5,
    STCost: 8,
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 132],
    description: () => (Achievement(138).isUnlocked
      ? `Replicanti Galaxies are ${formatPercents(AbsurdityUpgrade.RGCap.isBought ? 0.6 : 0.5)} stronger`
      : `Replicanti are ${formatX(10)} slower until ${format(Number.MAX_VALUE, 2)} and blue light is disabled` +
    `, but Replicanti Galaxies are ${formatPercents(AbsurdityUpgrade.RGCap.isBought ? 0.6 : 0.5)} stronger`),
    effect: () => AbsurdityUpgrade.RGCap.isBought ? 0.6 : 0.5
  },
  {
    id: 141,
    cost: DC.D8,
    STCost: 2,
    requirement: [131],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [142, 143],
    description: () => (Perk.studyActiveEP.isBought
      ? `You gain ${formatX(DC.E45)} more Infinity Points`
      : "Multiplier to Infinity Points, which decays over this Infinity"),
    effect: () => (Perk.studyActiveEP.isBought
      ? DC.E200
      : DC.E200.divide(thisInfinityMult(Time.thisInfinity.totalSeconds)).clampMin(1)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 2, 1))
  },
  {
    id: 142,
    cost: DC.D8,
    STCost: 2,
    requirement: [132],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 143],
    description: () => `You gain ${formatX(passiveIPMult())} more Infinity Points`,
    effect: passiveIPMult,
    cap: () => (Effarig.eternityCap === undefined ? undefined : Effarig.eternityCap.toNumber())
  },
  {
    id: 143,
    cost: DC.D8,
    STCost: 2,
    requirement: [133],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 142],
    description: "Multiplier to Infinity Points, which increases over this Infinity",
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisInfinity.plus(perkEffect).totalSeconds;
      return thisInfinityMult(totalSeconds);
    },
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  {
    id: 151,
    cost: new Decimal(8),
    requirement: [141, 142, 143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(1e20)} multiplier on all Time Dimensions`,
    effect: 1e20
  },
  {
    id: 161,
    cost: new Decimal(7),
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(DC.E5000)} multiplier on all Antimatter Dimensions`,
    effect: () => DC.E5000
  },
  {
    id: 162,
    cost: new Decimal(7),
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(1e70)} multiplier on all Prism Dimensions`,
    effect: 1e70
  },
  {
    id: 163,
    cost: new Decimal(7),
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(DC.E500)} multiplier on all Infinity Dimensions`,
    effect: DC.E500
  },
  {
    id: 171,
    cost: new Decimal(15),
    requirement: [161, 162, 163],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Time Shard requirement for the next Tickspeed upgrade goes up slower
      ${formatX(3.33, 0, 2)} ➜ ${formatX(1.7, 0, 1)}`,
    effect: () => 1.7
  },
  {
    id: 181,
    cost: new Decimal(50),
    requirement: [171,
      () => EternityChallenge(1).completions > 0 || Perk.bypassEC1Lock.isBought,
      () => EternityChallenge(2).completions > 0 || Perk.bypassEC2Lock.isBought,
      () => EternityChallenge(3).completions > 0 || Perk.bypassEC3Lock.isBought,
      () => EternityChallenge(4).completions > 0 || Perk.bypassEC4Lock.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `You gain ${formatPercents(0.01)} of your Infinity Points gained on crunch each second`,
    effect: () => gainedInfinityPoints().times(Time.deltaTime.div(100))
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige)
  },
  {
    id: 191,
    cost: new Decimal(200),
    requirement: [181, () => EternityChallenge(11).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `After Eternity you permanently keep ${formatPercents(0.1)}
    of your Infinities as Banked Infinities`,
    effect: () => Currency.infinities.value.times(0.1).floor()
  },
  {
    id: 192,
    cost: new Decimal(250),
    requirement: [181, () => EternityChallenge(11).completions > 0, () => !Enslaved.isRunning],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => (Enslaved.isRunning
      ? "There is not enough space in this Reality"
      : `Replicanti can go beyond ${format(replicantiCap(), 2, 1)}, but growth slows down at higher amounts`)
  },
  {
    id: 193,
    cost: new Decimal(200),
    requirement: [181, () => EternityChallenge(11).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: "Antimatter Dimension multiplier based on Eternities",
    effect: () => DC.E13000.pow(Currency.eternities.value.div(2.5e4)),
    cap: DC.E1E6,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 201,
    cost: new Decimal(1150),
    requirement: [192],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Unlock, Quasma"
  },
  {
    id: 211,
    cost: new Decimal(120),
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Dimension Boost requirement scaling is reduced by ${formatInt(5)}`,
    effect: 5
  },
  {
    id: 212,
    cost: new Decimal(150),
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "All Galaxies are stronger based on your Time Shards",
    effect: () => Decimal.pow(Currency.timeShards.value.clampMin(2).log2(), 0.025),
    cap: new Decimal(1.25),
    formatEffect: value => `+${formatPercents(value.sub(1), 3)}`
  },
  {
    id: 213,
    cost: new Decimal(200),
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain Replicanti ${formatInt(500)} times faster`,
    effect: 500
  },
  {
    id: 214,
    cost: new Decimal(120),
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimensional Sacrifice boosts the 8th Antimatter Dimension even more",
    effect: () => {
      const totalBoost = Sacrifice.totalBoost;
      const firstPart = totalBoost.pow(7.6).clampMaxExponent(150000);
      const secondPart = totalBoost.pow(1.1).clampMaxExponent(300000);
      const ThirdPart = totalBoost.pow(0.55);
      return firstPart.mul(secondPart).mul(ThirdPart);
    },
    cap: DC.E1E6,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 221,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [222],
    description: "Time Dimension multiplier based on Dimension Boosts",
    effect: () => DC.D1_0025.pow(DimBoost.totalBoosts),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 222,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [221],
    description: () => `Dimension Boost costs scale by another ${formatInt(2)} less`,
    effect: 2
  },
  {
    id: 223,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [224],
    description: () => `Distant Galaxy cost scaling starts ${formatInt(40)} Galaxies later`,
    effect: 40
  },
  {
    id: 224,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [223],
    description() {
      const effect = TimeStudy(224).effectValue;
      return `Distant Galaxy cost scaling starts ${quantifyInt("Galaxy", effect)} later
        (${formatInt(1)} per ${formatInt(1250)} Dim Boosts)`;
    },
    effect: () => Decimal.floor(DimBoost.totalBoosts.div(1250))
  },
  {
    id: 225,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [226],
    description: "You gain extra Replicanti Galaxies based on Replicanti amount",
    effect: () => Decimal.floor(Replicanti.amount.clampMin(1).log10().div(500)),
    formatEffect: value => `+${formatInt(value)} RG`
  },
  {
    id: 226,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [225],
    description: "You gain extra Replicanti Galaxies based on their max",
    effect: () => Decimal.floor(player.replicanti.boughtGalaxyCap.div(5)),
    formatEffect: value => `+${formatInt(value)} RG`
  },
  {
    id: 227,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [228],
    description: "Dimensional Sacrifice affects 4th Time Dimension with reduced effect",
    effect: () => Decimal.max(Decimal.pow(Sacrifice.totalBoost.absLog10(), 10), 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 228,
    cost: new Decimal(500),
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [227],
    description: () => `Dimensional Sacrifice formula scales better
      ${Sacrifice.getSacrificeDescription({ "TimeStudy228": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "TimeStudy228": true })}`,
    effect: 1.1
  },
  {
    id: 231,
    cost: new Decimal(300),
    STCost: 5,
    requirement: [221, 222],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [232],
    description: "Dimension Boosts are stronger based on their amount",
    effect: () => Decimal.pow(DimBoost.totalBoosts, 0.5).mul(15).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 232,
    cost: new Decimal(300),
    STCost: 5,
    requirement: [223, 224],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [231],
    description: "All Galaxies are stronger based on Antimatter Galaxies",
    effect: () => Decimal.pow(player.galaxies.div(500).add(1), 0.25),
    formatEffect: value => `+${formatPercents(value.sub(1), 3)}`
  },
  {
    id: 233,
    cost: new Decimal(300),
    STCost: 5,
    requirement: [225, 226],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [234],
    description: "Max Replicanti Galaxy upgrade is cheaper based on current Replicanti",
    effect: () => Replicanti.amount.pow(0.45).max(1),
    formatEffect: value => `/ ${format(value, 1, 2)}`
  },
  {
    id: 234,
    cost: new Decimal(300),
    STCost: 5,
    requirement: [227, 228],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [233],
    description: "Dimensional Sacrifice applies to 8th Infinity Dimension with reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.5),
  },
  // Note: These last 4 entries are the triad studies
  {
    id: 301,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1, 221, 222, 231],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [221, 222, 231],
    description: "Time Study 231 improves the effect of Time Study 221",
    effect: () => TimeStudy(221).effectValue.pow(TimeStudy(231).effectValue.minus(1)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1
  },
  {
    id: 302,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2, 223, 224, 232],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [223, 224, 232],
    description: () => `Distant Galaxy scaling threshold starts another ${formatInt(3000)} Antimatter Galaxies later`,
    effect: 3000,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2
  },
  {
    id: 303,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3, 225, 226, 233],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [225, 226, 233],
    description: () => `Gain ${formatPercents(0.5)} more extra Replicanti Galaxies from Time Studies 225 and 226,
      and from Effarig's Infinity`,
    effect: 1.5,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3
  },
  {
    id: 304,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4, 227, 228, 234],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [227, 228, 234],
    description: "Dimensional Sacrifice multiplier is squared",
    effect: 2,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4
  }
];
