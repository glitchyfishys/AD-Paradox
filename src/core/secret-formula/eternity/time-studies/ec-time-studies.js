import { DC } from "../../../constants";

export const ecTimeStudies = [
  {
    id: 1,
    cost: new Decimal(35),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternities",
      current: () => Currency.eternities.value,
      required: completions => new Decimal(20000 + Math.min(completions, Enslaved.isRunning ? 999 : 4) * 20000),
      formatValue: formatInt
    }
  },
  {
    id: 2,
    cost: new Decimal(40),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Prism Energy",
      current: () => Currency.prismEnergy.value,
      required: completions => Decimal.mul('e2500', Decimal.pow('e750', Math.min(completions, 4))),
      formatValue: formatInt
    }
  },
  {
    id: 3,
    cost: new Decimal(45),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Tickspeed upgrades from Time Dimensions",
      current: () => player.totalTickGained,
      required: completions => new Decimal(300 + Math.min(completions, 4) * 100),
      formatValue: formatInt
    }
  },
  {
    id: 4,
    cost: new Decimal(50),
    requirement: [171],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "8th Antimatter Dimensions",
      current: () => AntimatterDimension(8).totalAmount,
      required: completions => new Decimal(22750 + Math.min(completions, 4) * 2250),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 5,
    cost: new Decimal(70),
    requirement: [143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Infinities",
      current: () => Currency.infinitiesTotal.value,
      required: completions => new Decimal(1e8 + Math.min(completions, 4) * 2.5e7),
      formatValue: value => formatInt(Math.floor(value.toNumber()))
    }
  },
  {
    id: 6,
    cost: new Decimal(160),
    requirement: [42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Antimatter Galaxies",
      current: () => player.galaxies,
      required: completions => Decimal.min(completions, 4).times(10).add(230),
      formatValue: formatInt
    }
  },
  {
    id: 7,
    cost: new Decimal(85),
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Replicanti Galaxies",
      current: () => player.replicanti.galaxies,
      required: completions => Decimal.min(completions, 4).times(5).add(50),
      formatValue: formatInt
    }
  },
  {
    id: 8,
    cost: new Decimal(100),
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "antimatter",
      current: () => Currency.antimatter.value,
      required: completions => DC.E250000.pow(Math.min(completions, 4)).times(DC.E1E6),
      formatValue: value => format(value)
    }
  },
  {
    id: 9,
    cost: new Decimal(100),
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Infinity Points",
      current: () => Currency.infinityPoints.value,
      required: completions => DC.E400.pow(Math.min(completions, 4)).times(DC.E4300),
      formatValue: value => format(value)
    }
  },
  {
    id: 10,
    cost: new Decimal(115),
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Infinity Power",
      current: () => Currency.infinityPower.value,
      required: completions => DC.E30000.pow(Math.min(completions, 4)).times(DC.E90000),
      formatValue: value => format(value)
    }
  },
  {
    id: 11,
    cost: new Decimal(550),
    requirement: [181],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternity Points",
      current: () => Currency.eternityPoints.value,
      required: completions => DC.E20.pow(Math.min(completions, 4)).times(DC.E100),
      formatValue: value => format(value)
    }
  },
  {
    id: 12,
    cost: DC.D1,
    requirement: [231, 232],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      path: "Antimatter Dimension",
      forbiddenStudies: [72, 73, 74],
    }
  },
  {
    id: 13,
    cost: DC.D1,
    requirement: [233, 234],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      path: "Time Dimension",
      forbiddenStudies: [71, 72, 73],
    }
  }
];
