<script>
import PrismDimensionRow from "./PrismDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernInfinityDimensionsTab",
  components: {
    PrimaryButton,
    PrismDimensionRow
  },
  data() {
    return {
      prismEnergy: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEnslavedRunning: false,
      isAnyAutobuyerUnlocked: false,
      conversionRate: new Decimal(0),
      totalDimCap: new Decimal(0),
      creditsClosed: false,
      showLockedDimCostNote: true,
    };
  },
  methods: {
    update() {
      this.prismEnergy.copyFrom(Currency.prismEnergy);
      this.conversionRate.copyFrom(PrismDimensions.conversionRate);
      this.powerPerSecond.copyFrom(PrismDimension(1).productionPerSecond);
      this.incomeType = EternityChallenge(7).isRunning ? "Seventh Dimensions" : "Prism Energy";
      this.dimMultiplier.copyFrom(this.prismEnergy.pow(this.conversionRate).max(1));
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.totalDimCap.copyFrom(InfinityDimensions.totalDimCap);
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    maxAll() {
      PrismDimensions.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllPrismDims();
    },
  }
};
</script>

<template>
  <div class="l-infinity-dim-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have
        <span class="c-prism-dim-description__accent">{{ format(prismEnergy, 2, 1) }}</span>
        Prism Energy,
        <br>
        increased by
        <span class="c-prism-dim-description__accent">{{ formatPow(conversionRate, 2, 3) }}</span>
        making a
        <span class="c-prism-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
        unnerfed multiplier to Paradox Power and all Antimatter Dimensions.
      </p>
    </div>
    
    <div v-if="isEnslavedRunning">
      All Prism Dimensions are limited to a single purchase.
    </div>
    <div>You are getting {{ format(powerPerSecond, 2, 0) }} {{ incomeType }} per second.</div>
    <div class="l-dimensions-container">
      <PrismDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
  </div>
</template>
