import { DC } from "../../constants";

export const lightEffects = {
  ADMul: {
    id: "ADMul",
    slotID: 0,
    color: "red",
    unlocked: () => Currency.prismEnergy.gte(DC.E350),
    description: () => "Multiply Antimatter Dimensions based on red light",
    lockedDescription: () => `Reach ${format('e350')} Prism Energy`,
    effect: () => {
      let v = Currency.light.red;
      if(v.gt('1e27')) v = v.div(v.div('1e27').pow(0.95));
    
      v = v.pow(0.16).pow10().max(1);

      if(v.gt('e10000')) v = v.pow(v.log('e10000').pow(0.7).recip());

      return v.min('e25000');
    },
    formatEffect: value => formatX(value, 2, 2),
    get gain() {
      return Currency.prismEnergy.value.pow(0.05);
    }
  },
  DTMul: {
    id: "DTMul",
    color: "green",
    slotID: 1,
    unlocked: () => Currency.timeTheorems.value.gte(1e6),
    description: () => "Dilated Time multiplier based on green light",
    lockedDescription: () => `Have a total of ${format(1e6)} Time Theorem`,
    effect: () => {
      let v = Currency.light.green.pow(0.1).mul(3).max(1);
      if (v.gt(100)) v = v.div(v.div(100).pow(0.85));
      if (v.gt(5e3)) v = v.div(v.div(5e3).pow(0.95));
      return v;
    },
    formatEffect: value => formatX(value, 2, 2),
    get gain() {
      return Currency.prismEnergy.value.pow(0.0005).div(1e200);
    }
  },
  Replicanti: {
    id: "Replicanti",
    slotID: 2,
    color: "blue",
    unlocked: () => Currency.prismEnergy.gte(DC.E111),
    description: () => "Multiply Replicanti Speed and it's cap based on blue light",
    lockedDescription: () => `Reach ${format('e111')} Prism Energy`,
    effect() {
      if(TimeStudy(133).isBought && !Achievement(138).isUnlocked) return DC.D1;
      else {
        let V = Currency.light.blue.pow(0.05).max(1);
        if(V.gt(25)) return V.div(V.div(25).pow(0.85)).min(10000);
        return V;
      };
      },
    secondEffect() {
      let V = Decimal.pow10(Currency.light.blue.pow(0.033).max(0));
      if(V.gt(100)) return V.div(V.div(100).pow(0.85)).min(10000);
      return V;
    },
    cap: 1e5,
    formatEffect: value => {return `${TimeStudy(133).isBought && !Achievement(138).isUnlocked ? "Disabled by Time Study 133" : formatX(value, 2, 2)}, ${formatX(Decimal.pow10(Light.Replicanti.config.secondEffect()), 2, 2)} `;},
    get gain() {
      return Currency.prismEnergy.value.pow(0.05);
    }
  },
  IDMul: {
    id: "IDMul",
    color: "yellow",
    slotID: 3,
    unlocked: () => false,
    description: () => "Infinity Dimensions multiplier based on yellow light",
    lockedDescription: () => `NYI`,
    effect: () => Currency.light.yellow.pow(0.15).max(1),
    formatEffect: value => formatX(value, 2, 2),
    get gain() {
      return Currency.light.red.mul(Currency.light.green).pow(1e-6);
    }
  },
  EPMul: {
    id: "EPMul",
    slotID: 4,
    color: "purple",
    unlocked: () => Currency.eternityPoints.gte(5),
    description: () => "Eternity Point multiplier based on purple light",
    lockedDescription: () => `Have ${format(5)} Eternity Points`,
    effect: () => {
      let v = Currency.light.purple;
      v = v.pow(3).max(1);

      if (v.gt('e100')) v = v.div(v.div('e100').pow(0.33));

      return v;
    },
    formatEffect: value => formatX(value, 2, 2),
    get gain() {
      let v = Currency.light.red.mul(Currency.light.blue).pow(0.05);
      return v;
    }
  },
  RMMul: {
    id: "RM",
    slotID: 5,
    color: "cyan",
    unlocked: () => Currency.realityMachines.gte(20),
    description: () => "Reality Machines multiplier based on cyan light",
    lockedDescription: () => `Reach 20 Reality Machines`,
    effect: () => Currency.light.cyan.pow(0.5).max(1),
    formatEffect: value => formatX(value, 2, 2),
    get gain() {
      return Currency.light.blue.mul(Currency.light.green).pow(1e-4);
    }
  },
  TachyonParticles: {
    id: "TachyonParticles",
    slotID: 6,
    color: "white",
    unlocked: () => false,
    description: () => "Tachyon Particle multiplier based on white light",
    lockedDescription: () => `NYI`,
    effect: () => Currency.light.white.pow(0.15).max(1),
    formatEffect: value => formatX(value, 2, 2),
    get gain() {
      return Currency.light.yellow.mul(Currency.light.purple).mul(Currency.light.cyan).pow(1e-10);
    }
  },
};
