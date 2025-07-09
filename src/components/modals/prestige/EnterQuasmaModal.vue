<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterQuasmaModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return `Quasma will start a new Absurdity, all Dimension multiplier's and tickspeed multiplier's exponents
        exponent will be reduced to ${formatPow(0.05, 2, 2)}. While in Quasma, your Nitronic Energy will be
        increased to a value based on your highest antimatter and any Nitronic Energy multipliers you have.`;
    },
    entranceLabel() {
      return `You are about to enter Quasma`;
    },
    EPSinceLabel() {
      if (!isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied) {
        return `You already have the maximum feasible amount of Nitronic Energy you can attain due to
          Teresa's Level ${formatInt(25)} reward.`;
      }
      return "";
    }
  },
  methods: {
    handleYesClick() {
      if (player.absurdity.quasma.active) return;
        startQuasmaAbsurdity();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="quasma"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ EPSinceLabel }}
      <br>
      <br>
      {{ message }}
    </div>
    <template #confirm-text>
      Enter
    </template>
  </ModalWrapperChoice>
</template>
