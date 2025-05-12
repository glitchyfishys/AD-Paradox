<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "PrismUpgradeButton",
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
      showWorstChallenge: false,
      worstChallengeString: "",
      isUseless: false,
      canBeBought: false,
      chargePossible: false,
      canBeCharged: false,
      isBought: false,
      isCharged: false,
      isDisabled: false,
      showingCharged: false,
      hasTS31: false,
      ts31Effect: new Decimal(0)
    };
  },
  computed: {
    config() {
      const config = this.upgrade.config;
      return config;
    },
    classObject() {
      return {
        "o-paradox-upgrade-btn": true,
        "o-paradox-upgrade-btn--bought": !this.isUseless && this.isBought,
        "o-paradox-upgrade-btn--available": !this.isUseless && !this.isBought && this.canBeBought,
        "o-paradox-upgrade-btn--unavailable": !this.isUseless && !this.isBought && !this.canBeBought,
        "o-paradox-upgrade-btn--useless": this.isUseless,
        "o-pelle-disabled": this.isUseless,
        "o-paradox-upgrade-btn--chargeable": !this.isCharged && this.chargePossible &&
          (this.showingCharged || this.shiftDown),
        "o-paradox-upgrade-btn--charged": this.isCharged,
        "o-pelle-disabled-pointer": this.isUseless
      };
    },
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isBought = upgrade.isBought || upgrade.isCapped;
      this.chargePossible = Ra.unlocks.chargedInfinityUpgrades.canBeApplied &&
        upgrade.hasChargeEffect && !Pelle.isDoomed;
      this.canBeBought = upgrade.canBeBought;
      this.canBeCharged = upgrade.canCharge;
      this.isCharged = upgrade.isCharged;
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
      name="Prism Energyr"
    />
    <slot />
  </button>
</template>

<style scoped>

</style>
