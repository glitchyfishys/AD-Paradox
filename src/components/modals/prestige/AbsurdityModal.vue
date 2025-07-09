<script>
import ResetModal from "./ResetModal";

export default {
  name: "AbsurdityModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedAE: new Decimal(),
    };
  },
  computed: {
    message() {
      return `Upon Absurdity, Eternity and before will be reset except Achievements, Eternities, Eternity Challenges and Dilation.`;
    },
    AEGainInfo() {
      return `You will gain ${quantify("Absurdity Energy", this.gainedAE, 2, 0)} and Aberdities equal to Eternities.`;
    },
  },
  methods: {
    update() {
      this.gainedAE = gainedAbsurdityEnergy().round();
    },
    handleYesClick() {
      absurdityResetRequest();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ResetModal
    header="You are about to Absurdity"
    :message="message"
    :gained-resources="AEGainInfo"
    :confirm-fn="handleYesClick"
    :alternate-text="message"
    :confirm-option="'absurdity'"
  />
</template>
