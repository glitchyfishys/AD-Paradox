<script>
import FullScreenAnimationHandler from "@/core/full-screen-animation-handler";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitQuasmaModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      nitronicGain: new Decimal(0),
    };
  },
  computed: {
    gainText() {
      if (this.nitronicGain.lte(0)) return `not gain anything`;
      return `gain ${quantify("Nitronic Energy", this.nitronicGain, 2, 1)}`;
    },
    isInEC() {
      return Player.anyChallenge instanceof EternityChallengeState;
    },
  },
  methods: {
    update() {
      // We force-close the modal if dilation is inactive because there are a few edge cases which allow it to be
      // opened while switching between dilated/regular. The only thing this results in is an incorrect TP gain value
      if (!player.absurdity.quasma.active) this.emitClose();
      this.nitronicGain.copyFrom(getNitronicGain());
    },
    handleYesClick() {
      if (!player.absurdity.quasma.active) return;
      absurdityReset(true);
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
      <span>
        You are about to exit Quasma
      </span>
    </template>
    <div class="c-modal-message__text">
        If you exit Quasma now, you will {{ gainText }}.
      <div v-if="isInEC">
        You will also exit your current Eternity Challenge as well.
      </div>
      <br>
      Are you sure you want to proceed?
    </div>
    <template #confirm-text>
      Exit
    </template>
  </ModalWrapperChoice>
</template>
