<script>
import LightSlot from "./LightSlot";

export default {
  name: "LightTab",
  components: {
    LightSlot,
  },
  data() {
    return {
      isUseless: false,
    };
  },
  computed: {
    grid() {
      return [
        [
          Light.ADMul,
          Light.IDMul
        ],
        [
          Light.DTMul,
          Light.EPMul,
          Light.TachyonParticles
        ],
        [
          Light.Replicanti,
          Light.Eternities
        ],
      ];
    },
    allColumnUpgrades() {
      return this.grid.flat();
    },
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
      if (location.isBought) return "var(--color-paradox)";
      return "transparent";
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
        <LightSlot
          v-for="col in column"
          :key="col.id"
          :color="col"
          :class="btnClassObject(columnId)"
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
