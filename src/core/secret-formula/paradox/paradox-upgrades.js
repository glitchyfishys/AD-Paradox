
export const paradoxUpgrades = {
  ADbuy10_1: {
    id: "ADbuy10_1",
    cost: 1,
    description: () => `Antimatter Dimensions have a buy 10 multiplier of ${formatX(5)}`,
    effect: () => 5,
    charged: {
      description: () => `Antimatter Dimensions gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  ADCheaper_1: {
    id: "ADCheaper_1",
    cost: 15,
    checkRequirement: () => ParadoxUpgrade.ADbuy10_1.isBought,
    description: () => `Antimatter Dimensions are ${formatX(100)} cheaper`,
    effect: () => 100,
    charged: {
      description: () => `Antimatter Dimensions gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  ADScaleLess_1: {
    id: "ADScaleLess_1",
    cost: 30,
    checkRequirement: () => ParadoxUpgrade.ADCheaper_1.isBought,
    description: () => `Antimatter Dimensions scale ${formatPercents(0.15)} less`,
    effect: () => 0.85,
    charged: {
      description: () => `Antimatter Dimensions gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  BaseAD_1: {
    id: "BaseAD_1",
    cost: 3,
    description: () => `Antimatter Dimensions are multiplied by ${formatX(50)}`,
    effect: () => 50,
    charged: {
      description: () => `Antimatter Dimensions gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  BaseAD_2: {
    id: "BaseAD_2",
    cost: 10,
    checkRequirement: () => ParadoxUpgrade.BaseAD_1.isBought,
    description: () => `Antimatter Dimensions are multiplied by ${formatX(1000)}`,
    effect: () => 1000,
    charged: {
      description: () => `Antimatter Dimensions gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  BaseAD_3: {
    id: "BaseAD_3",
    cost: 40,
    checkRequirement: () => ParadoxUpgrade.BaseAD_2.isBought,
    description: () => `Antimatter Dimensions are powered by ${formatPow(1.33, 2, 2)}`,
    effect: () => 1.33,
    charged: {
      description: () => `Antimatter Dimensions gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  Dimboost_1: {
    id: "Dimboost_1",
    cost: 5,
    description: () => `Dimensions Boosts have a base multiplier of ${formatX(8)}`,
    effect: () => 8,
    charged: {
      description: () => `Dimensions Boosts gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  DimSacAllADs_1: {
    id: "DimSacAllADs_1",
    cost: 8,
    checkRequirement: () => ParadoxUpgrade.Dimboost_1.isBought,
    description: () => `Dimensional Sacrifice affect all Antimatter Dimensions`,
    effect: () => 1,
    charged: {
      description: () => `Dimensions Boosts gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  GalaxyBoost_1: {
    id: "GalaxyBoost_1",
    cost: 35,
    checkRequirement: () => ParadoxUpgrade.DimSacAllADs_1.isBought,
    description: () => `Galaxies are ${formatPercents(0.5)} stronger`,
    effect: () => 1.5,
    charged: {
      description: () => `Dimensions Boosts gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  Tickspeed_1: {
    id: "Tickspeed_1",
    cost: 5,
    description: () => `Tickspeed have a base multiplier of ${formatX(1.25,2,2)}`,
    effect: () => 1.25,
    charged: {
      description: () => `Tickspeed gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  TickspeedCheaper_1: {
    id: "TickspeedCheaper_1",
    cost: 10,
    checkRequirement: () => ParadoxUpgrade.Tickspeed_1.isBought,
    description: () => `Tickspeed scale ${formatPercents(0.1)} less`,
    effect: () => 0.9,
    charged: {
      description: () => `Tickspeed gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  TickspeedFree_1: {
    id: "TickspeedFree_1",
    cost: 15,
    checkRequirement: () => ParadoxUpgrade.TickspeedCheaper_1.isBought,
    description: () => `Gain ${formatPercents(0.25)} more Tickspeed upgrades as free upgrades`,
    effect: () => player.totalTickBought.mul(0.25),
    formatEffect: value => `${formatAdd(value, 2, 2)}`,
    charged: {
      description: () => `Tickspeed gain a buy 10 multiplier based on Teresa level`,
      effect: () =>
       Decimal.pow(Ra.pets.teresa.level, 0.5),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  Ach_1: {
    id: "Ach_1",
    cost: 6,
    description: () => `Achievement multiplier have a base multiplier of ${formatX(1.3,2,1)} and ${formatX(3)} for completed rows`,
    effect: () => 1.3,
  },
  AllADsAreUnlocked_1: {
    id: "AllADsAreUnlocked_1",
    cost: 12,
    checkRequirement: () => ParadoxUpgrade.Ach_1.isBought,
    description: () => `All Antimatter Dimensions are unlocked without Dimension Boosts`,
    effect: () => 1,
  },
  DBandAGScaleLess_1: {
    id: "DBandAGScaleLess_1",
    cost: 35,
    checkRequirement: () => ParadoxUpgrade.AllADsAreUnlocked_1.isBought,
    description: () => `Dimension Boosts and Antimatter Galaxies scale 5 and 10 less respectfully`,
    effect: () => 5,
  }
};
