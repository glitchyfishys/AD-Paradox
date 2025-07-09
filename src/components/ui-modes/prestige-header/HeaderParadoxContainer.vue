<script>
export default {
  name: "HeaderParadoxContainer",
  data() {
    return {
      canParadox: false,
      PPGained: new Decimal(),
      PPAmount: new Decimal(),
    };
  },
  computed: {
    classObject() {
      return {
        "c-paradox-button--unlocked": this.canParadox,
        "c-paradox-button--locked": !this.canParadox,
      };
    }
  },
  methods: {
    update() {
      this.canParadox = Player.canParadox;
      this.PPAmount.copyFrom(Currency.paradoxPower);
      if (!this.canParadox) {
        return;
      }
      this.PPGained = gainedParadoxPower();
    },
    handleClick() {
      if (this.canParadox) {
        manualParadoxResetRequest();
      }
    },
  }
};
</script>

<template>
  <div
  class="c-prestige-button-container"
  style="height: 6rem;"
  >
      <button
        class="o-prestige-button o-paradox-button"
        :class="classObject"
        @click="handleClick"
      >
        <div>
          <template v-if="canParadox">
            Paradox for {{ format(PPGained,2,2) }} PP
          </template>
          <template v-else>
            Reach {{ format(1e9,2,2) }} 1st AD
          </template>
        </div>
      </button>

    You have {{ format(PPAmount,2,2) }} Paradox Power

  </div>
</template>

<style scoped>

</style>
