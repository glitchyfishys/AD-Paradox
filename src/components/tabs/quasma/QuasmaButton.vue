<script>
export default {
  name: "QuasmaButton",
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      requiredForGain: new Decimal(),
      canEternity: false,
      nitronicGain: new Decimal(),
      remnantRequirement: 0,
      creditsClosed: false
    };
  },
  computed: {
    disableText() {
      // Doesn't need to be reactive or check strike status; it's always permanent once entered in Doomed
      return Pelle.isDoomed ? "Quasma is permanent." : "Exit Quasma.";
    }
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.quasmaUnlocked();
      this.isRunning = player.absurdity.quasma.active;
      this.remnantRequirement = Pelle.remnantRequirementForQuasma;
      if (!this.isRunning) return;
      this.canEternity = Player.canEternity;
      // This lets this.hasGain be true even before eternity.
      this.hasGain = getNitronicGain().gt(0);
      if (this.hasGain) {
        this.nitronicGain.copyFrom(getNitronicGain());
      } else {
        this.requiredForGain.copyFrom(getNitronicReq());
      }
      this.creditsClosed = GameEnd.creditsEverClosed;
    },
    quasma() {
      if (this.creditsClosed) return;
      startQuasmaAbsurdityRequest();
    }
  }
};
</script>

<template>
  <button
    class="o-quasma-btn"
    :class="isUnlocked ? 'o-quasma-btn--unlocked' : 'o-quasma-btn--locked'"
    @click="quasma()"
  >
    <span v-if="!isUnlocked">Purchase the Quasma Study to unlock.</span>
    <span v-else-if="!isRunning">
      Enter Quasma and gain Nitronic Energy.
    </span>
    <span v-else-if="hasGain">
      {{ disableText }}
      <br>
      gain {{ format(nitronicGain, 2, 2) }} Nitronic Energy.
    </span>
    <span v-else>
      {{ disableText }}
      <br>
      Reach {{ format(requiredForGain, 2, 1) }} antimatter to gain more Nitronic Energy.
    </span>
  </button>
</template>

<style scoped>

</style>
