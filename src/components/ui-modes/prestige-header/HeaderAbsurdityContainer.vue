<script>
export default {
  name: "HeaderAbsurdityContainer",
  data() {
    return {
      canAbsurdity: false,
      AEGained: new Decimal(),
      AEAmount: new Decimal(),
    };
  },
  computed: {
    classObject() {
      return {
        "c-absurdity-button--unlocked": this.canAbsurdity,
        "c-absurdity-button--locked": !this.canAbsurdity,
      };
    }
  },
  methods: {
    update() {
      this.isUnlocked = PlayerProgress.eternityUnlocked();
      this.canAbsurdity = Player.canAbsurdity;
      this.AEAmount.copyFrom(Currency.absurdityEnergy);
      if (!this.canAbsurdity) {
        return;
      }
      this.AEGained = gainedAbsurdityEnergy();
    },
    handleClick() {
      if (this.canAbsurdity) {
        manualAbsurdityResetRequest();
      }
    },
  }
};
</script>

<template>
  <div
  class="c-prestige-button-container"
  style="height: 6rem;"
  v-if="isUnlocked"
  >
      <button
        class="o-prestige-button o-absurdity-button"
        :class="classObject"
        @click="handleClick"
      >
        <div>
          <template v-if="canAbsurdity">
            Absurdity for {{ format(AEGained,2,2) }} AE
          </template>
          <template v-else>
            Reach {{ format(1e9,2,2) }} 1st TD
          </template>
        </div>
      </button>

    You have {{ format(AEAmount,2,2) }} Absurdity Energy

  </div>
</template>

<style scoped>

</style>
