<script>
import AbsurdityUpgradeButton from "./AbsurdityUpgradeButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "AbsurdityUpgradesTab",
  components: {
    PrimaryButton,
    AbsurdityUpgradeButton
  },
  data() {
    return {
      isUseless: false,
      bottomRowUnlocked: false,
      styleOfColumnBg: undefined
    };
  },
  computed: {
    grid() {
      return [
        [
          AbsurdityUpgrade.ADNerf,
          AbsurdityUpgrade.PDNerf,
          AbsurdityUpgrade.IDNerf,
        ],
        [
          AbsurdityUpgrade.IPNerf,
          AbsurdityUpgrade.EPNerf,
          AbsurdityUpgrade.RGCap,
        ],
        [
          AbsurdityUpgrade.PPGain,
          AbsurdityUpgrade.AEGain,
          AbsurdityUpgrade.SacGain,
        ],
      ];
    },
    allColumnUpgrades() {
      return this.grid.flat();
    },
  },
  created() {
    this.on$(GAME_EVENT.ABSURDITY_UPGRADE_BOUGHT, () => this.setStyleOfColumnBg());

    this.setStyleOfColumnBg();
  },
  methods: {
    update() {
      this.isUseless = Pelle.isDoomed;
      
    },
    btnClassObject(column) {
      const classObject = {
        "l-infinity-upgrade-grid__cell": true
      };
      if (column > 0) {
        // Indexing starts from 0, while css classes start from 2 (and first column has default css class)
        classObject[`o-infinity-upgrade-btn--color-${column + 1}`] = true;
      }
      return classObject;
    },
    getColumnColor(location) {
      if (location == undefined) return "transparent";
      if (location.isBought) return "var(--color-absurdity)";
      return "transparent";
    },
    setStyleOfColumnBg() {
      this.styleOfColumnBg = this.grid.map(col => ({
        background:
          `linear-gradient(to bottom,
          ${this.getColumnColor(col[0])} 15%,
          ${this.getColumnColor(col[1])} 35% 40%,
          ${this.getColumnColor(col[2])} 66% 100%`
      }));
    },
  }
};
</script>

<template>
  <div class="l-infinity-upgrades-tab">
    <br>
    <div class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid">
      <div
        v-for="(column, columnId) in grid"
        :key="columnId"
        class="c-infinity-upgrade-grid__column"
      >
        <AbsurdityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
          :class="btnClassObject(columnId)"
        />
        <div
          class="c-infinity-upgrade-grid__column--background"
          :style="styleOfColumnBg[columnId]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-infinity-upgrade-grid__column {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  position: relative;
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0 0.3rem;
}

.c-infinity-upgrade-grid__column--background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.7;
}

.s-base--dark .c-infinity-upgrade-grid__column--background {
  opacity: 0.5;
}

.l-infinity-upgrades-bottom-row .l-infinity-upgrade-grid__cell,
.l-infinity-upgrades-bottom-row .l-infinity-upgrades-tab__mult-btn {
  margin: 0.5rem 1.1rem;
}
</style>
