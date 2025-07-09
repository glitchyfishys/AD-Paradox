
export const prismUpgrades = {
  PPBoostIP_1: {
    id: "PPBoostIP_1",
    cost: 1e6,
    description: () => `Multiply IP based on PP`,
    effect: () => Currency.paradoxPower.value.pow(3).max(1),
    formatEffect: value => formatX(value, 2, 2),
    cap: new Decimal('e22000')
  },
  PPBoostAD_1: {
    id: "PPBoostAD_1",
    cost: 5e6,
    description: () => `Multiply Antimatter Dimensions based on PP`,
    effect: () => Currency.paradoxPower.value.pow(4.5).max(1),
    formatEffect: value => formatX(value, 2, 2),
    cap: new Decimal('e33000')
  },
  PPBoostTS_1: {
    id: "PPBoostTS_1",
    cost: 2e7,
    description: () => `Multiply Tickspeed based on PP`,
    effect: () => Currency.paradoxPower.value.pow(2.5).max(1),
    formatEffect: value => formatX(value, 2, 2),
    cap: new Decimal('e20000')
  },
  KeepRow2_1: {
    id: "KeepRow2_1",
    cost: 3e6,
    description: () => `Keep all Paradox upgrades on Resets`,
    effect: () => 1,
  },
  KeepPP_1: {
    id: "KeepPP_1",
    cost: 1e7,
    description: () => `Keep Paradox Power on Infinity`,
    effect: () => 1,
  },
  PPBoostPD_1: {
    id: "PPBoostPD_1",
    cost: 5e7,
    description: () => `Multiply 1st Prism Dimension based on PP`,
    effect: () => Currency.paradoxPower.value.pow(0.5).max(1),
    formatEffect: value => formatX(value, 2, 2),
  },
  AD8BoostPP_1: {
    id: "AD8BoostPP_1",
    cost: 1e8,
    description: () => `Multiply PP based on 8th Antimatter Dimensions`,
    effect: () => AntimatterDimension(8).totalAmount.pow(0.5).div(9).max(1),
    formatEffect: value => formatX(value, 2, 2),
  },
  TripleIPBoost: {
    id: "TripleIPBoost",
    cost: 5e8,
    description: () => `Triple the rebuyable IP multiplier`,
    effect: 3,
  },
  PPBoostGal: {
    id: "PPBoostGal",
    cost: 1e10,
    description: () => `Galaxies are stronger based on PP`,
    effect: () => Currency.paradoxPower.value.add(1).log10().pow(0.2).div(10).add(1),
    formatEffect: value => formatX(value, 2, 2),
    cap: 1.3
  },
  PEBoostID: {
    id: "PEBoostID",
    cost: 1e15,
    description: () => `Multiply IDs based on PE`,
    effect: () => Currency.prismEnergy.value.pow(2.5).max(1),
    formatEffect: value => formatX(value, 2, 2),
    cap: new Decimal('e200000')
  },
  IPBoostPD: {
    id: "IPBoostPD",
    cost: 5e16,
    description: () => `Multiply PDs based on IP`,
    effect: () => Currency.infinityPoints.value.pow(0.3).max(1),
    formatEffect: value => formatX(value, 2, 2),
    cap: new Decimal('e5000')
  },
  GalBoost: {
    id: "GalBoost",
    cost: 1e20,
    description: () => `Galaxies are ${formatPercents(0.1)} stronger`,
    effect: () => 1.1,
  },
};
