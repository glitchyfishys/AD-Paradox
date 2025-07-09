<script>
import QuasmaButton from "./QuasmaButton";
import QuasmaUpgradeButton from "./QuasmaUpgradeButton";

export default {
  name: "QuasmaTab",
  components: {
    QuasmaButton,
    QuasmaUpgradeButton
  },
  data() {
    return {
      nitronicEnergy: new Decimal(),
      chromaticEnergy: new Decimal(),
      chromaticEnergyIncome: new Decimal(),
      hasPelleDilationUpgrades: false,
      maxDT: new Decimal(),
      isHovering: false,
    };
  },
  computed: {
    rebuyables() {
      return [
        [
          QuasmaUpgrade.chromaticGain,
          QuasmaUpgrade.galaxyStrength,
          QuasmaUpgrade.nitronicGain,
        ],
        [
          QuasmaUpgrade.ADMul,
          QuasmaUpgrade.IDMul,
          QuasmaUpgrade.TDMul,
        ]
      ];
    },
    upgrades() {
      return [
        [
          QuasmaUpgrade.autoRGP,
          QuasmaUpgrade.ADMultCE,
          QuasmaUpgrade.ipMultCE
        ],
        [
          QuasmaUpgrade.dimNerf,
          QuasmaUpgrade.buy10Dim,
          QuasmaUpgrade.quasmaPenalty
        ],
        [
          QuasmaUpgrade.nitronicBoostChromatic,
          QuasmaUpgrade.infinityConversion,
          QuasmaUpgrade.AEMulNE,
        ]
      ];
    },
    // This might be negative due to rift drain, so we need to add "+" iff the value is positive. The actual
    // addition of a negative sign (or not) is assumed to be handled in a notation-specific way
    chromaticEnergyGainText() {
      const sign = this.chromaticEnergyIncome.gte(0) ? "+" : "";
      return `${sign}${format(this.chromaticEnergyIncome, 2, 1)}`;
    },
    hasMaxText: () => PlayerProgress.realityUnlocked() && !Pelle.isDoomed,
    allRebuyables() {
      return this.rebuyables;
    },
    allSingleUpgrades() {
      const upgradeRows = [];
      upgradeRows.push(...this.upgrades);
      return upgradeRows;
    },
  },
  methods: {
    maxPurchaseQuasmaUpgrades() {
      maxPurchaseQuasmaUpgrades();
    },
    update() {
      this.nitronicEnergy.copyFrom(Currency.nitronicEnergy);
      this.chromaticEnergy.copyFrom(Currency.chromaticEnergy);
      this.chromaticEnergyIncome = getChromaticEnergyGainPerSecond().times(getGameSpeedupForDisplay());
    }
  }
};
</script>

<template>
  <div class="l-dilation-tab">
    <span>
      You have
      <span class="c-dilation-tab__tachyons">{{ format(nitronicEnergy, 2, 1) }}</span>
      {{ pluralize("Nitronic Energy", nitronicEnergy) }}.
    </span>
    <div
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <QuasmaButton />
    </div>
    <span>
      You have
      <span class="c-dilation-tab__dilated-time">{{ format(chromaticEnergy, 2, 1) }}</span>
      Chromatic Energy.
      <span class="c-dilation-tab__dilated-time-income">{{ chromaticEnergyGainText }}/s</span>
    </span>
    <button
      class="o-primary-btn l-button-container"
      @click="maxPurchaseQuasmaUpgrades"
    >
      Max Quasma Upgrades
    </button>
    <div class="l-dilation-upgrades-grid">
      <div
        v-for="(upgradeRow, row) in allRebuyables"
        :key="'rebuyable' + row"
        class="l-dilation-upgrades-grid__row"
      >
        <QuasmaUpgradeButton
          v-for="upgrade in upgradeRow"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="true"
          class="l-dilation-upgrades-grid__cell"
          :show-tooltip="isHovering"
        />
      </div>
      <div
        v-for="(upgradeRow, row) in allSingleUpgrades"
        :key="'single' + row"
        class="l-dilation-upgrades-grid__row"
      >
        <QuasmaUpgradeButton
          v-for="upgrade in upgradeRow"
          :key="upgrade.id"
          :upgrade="upgrade"
          :is-rebuyable="false"
          class="l-dilation-upgrades-grid__cell"
          :show-tooltip="isHovering"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-accent {
  color: var(--color-dilation);
  font-size: 1.5rem;
  text-shadow: 0 0 0.2rem var(--color-reality-dark);
  cursor: default;
}

.l-dilation-upgrades-grid {
  display: flex;
  flex-direction: column;
}

.l-dilation-upgrades-grid__row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.l-dilation-upgrades-grid__cell {
  margin: 1.2rem 1.5rem;
}

.c-dilation-tab__tachyons {
  font-size: 3.5rem;
  color: black;
}

.c-dilation-tab__dilated-time {
  font-size: 3.5rem;
  color: black;
}

.t-metro .c-dilation-tab__tachyons,
.s-base--dark .c-dilation-tab__tachyons,
.t-s8 .c-dilation-tab__tachyons {
  color: #dd6464;
}

.t-dark .c-dilation-tab__tachyons,
.t-s6 .c-dilation-tab__tachyons,
.t-s10 .c-dilation-tab__tachyons {
  text-shadow: 0 0 0.7rem #dd6464;
}

.t-metro .c-dilation-tab__tachyons,
.t-metro .c-dilation-tab__dilated-time,
.t-metro .c-dilation-tab__dilated-time-income,
.t-metro .c-dilation-tab__galaxy-threshold,
.t-metro .c-dilation-tab__galaxies,
.t-s8 .c-dilation-tab__tachyons,
.t-s8 .c-dilation-tab__dilated-time,
.t-s8 .c-dilation-tab__dilated-time-income,
.t-s8 .c-dilation-tab__galaxy-threshold,
.t-s8 .c-dilation-tab__galaxies {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem black;
}

.t-metro .c-dilation-tab__dilated-time,
.t-metro .c-dilation-tab__dilated-time-income,
.t-metro .c-dilation-tab__galaxy-threshold,
.t-metro .c-dilation-tab__galaxies,
.s-base--dark .c-dilation-tab__dilated-time,
.s-base--dark .c-dilation-tab__dilated-time-income,
.s-base--dark .c-dilation-tab__galaxy-threshold,
.s-base--dark .c-dilation-tab__galaxies,
.t-s8 .c-dilation-tab__dilated-time,
.t-s8 .c-dilation-tab__dilated-time-income,
.t-s8 .c-dilation-tab__galaxy-threshold,
.t-s8 .c-dilation-tab__galaxies {
  color: var(--color-quasma);
}

.t-dark .c-dilation-tab__dilated-time,
.t-dark .c-dilation-tab__dilated-time-income,
.t-dark .c-dilation-tab__galaxy-threshold,
.t-dark .c-dilation-tab__galaxies,
.t-s6 .c-dilation-tab__dilated-time,
.t-s6 .c-dilation-tab__dilated-time-income,
.t-s6 .c-dilation-tab__galaxy-threshold,
.t-s6 .c-dilation-tab__galaxies,
.t-s10 .c-dilation-tab__dilated-time,
.t-s10 .c-dilation-tab__dilated-time-income,
.t-s10 .c-dilation-tab__galaxy-threshold,
.t-s10 .c-dilation-tab__galaxies {
  text-shadow: 0 0 0.7rem var(--color-quasma);
}

</style>
