<script>
import ResetModal from "./ResetModal";

export default {
  name: "ParadoxModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedPP: new Decimal(),
    };
  },
  computed: {
    message() {
      const info = this.isFirstParadox ? this.firstParadoxInfo : ``;
      return `Upon Paradoxing, all Dimensions, Dimension Boosts, and Antimatter Galaxies are reset. ${info}`;
    },
    firstParadoxInfo() {
      return `In return, you gain an Paradox Power (PP). This allows you to buy multiple upgrades that you can find in the Paradox tab.`;
    },
    PPGainInfo() {
      return `You will gain ${quantify("Paradox Power", this.gainedPP, 2, 0)}.`;
    },
  },
  methods: {
    update() {
      this.gainedPP = gainedParadoxPower().round();
    },
    handleYesClick() {
      paradoxResetRequest();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ResetModal
    header="You are about to Paradox"
    :message="message"
    :gained-resources="PPGainInfo"
    :confirm-fn="handleYesClick"
    :alternate-text="message"
    :confirm-option="'paradox'"
  />
</template>
