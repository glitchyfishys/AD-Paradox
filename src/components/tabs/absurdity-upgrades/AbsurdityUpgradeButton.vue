<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "AbsurdityUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUseless: false,
      canBeBought: false,
      isBought: false,
      isDisabled: false,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-absurdity-upgrade-btn": true,
        "o-absurdity-upgrade-btn--bought": !this.isUseless && this.isBought,
        "o-absurdity-upgrade-btn--available": !this.isUseless && !this.isBought && this.canBeBought,
        "o-absurdity-upgrade-btn--unavailable": !this.isUseless && !this.isBought && !this.canBeBought,
        "o-absurdity-upgrade-btn--useless": this.isUseless,
        "o-pelle-disabled": this.isUseless,
        "o-pelle-disabled-pointer": this.isUseless
      };
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.canBeBought = upgrade.canBeBought;
      this.isDisabled = upgrade.config.isDisabled && upgrade.config.isDisabled(upgrade.config.effect());
      this.isUseless = Pelle.uselessInfinityUpgrades.includes(upgrade.id) && Pelle.isDoomed;
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @click="upgrade.purchase()"
  >
    <span :class="{ 'o-pelle-disabled': isUseless }">
      <DescriptionDisplay
        :config="config"
      />
      <EffectDisplay
        v-if="!isDisabled"
        br
        :config="config"
      />
    </span>
    <CostDisplay
      v-if="!isBought"
      br
      :config="config"
      name="Absurdity Energy"
    />
    <slot />
  </button>
</template>

<style scoped>

</style>
