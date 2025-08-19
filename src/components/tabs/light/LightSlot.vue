<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryButton from "@/components/PrimaryButton.vue";

export default {
  name: "LightSlot",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    PrimaryButton
  },
  props: {
    color: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      gain: new Decimal(),
      amount: new Decimal(),
      isUnlocked: false,
      canReset: false,
      isPrimary: true,
      hue: '',
      lockedDescription: ''
    };
  },
  computed: {
    config() {
      const config = this.color.config;
      return config;
    },
  },
  methods: {
    update() {
      const color = this.color;
      this.gain.copyFrom(color.gain);
      this.canReset = this.gain.gte(1);
      this.hue = color.color == 'green' ? 'lime' : color.color;
      this.amount.copyFrom(Currency.light[color.color]);
      this.isUnlocked = color.isUnlocked;
      this.isPrimary = color.isPrimary;
      this.lockedDescription = color.lockedDescription;
    },
    reset(){
      if(this.canReset) this.color.split();
    }
  }
};
</script>

<template>
  <div class='light' 
  >
  <span v-if='isUnlocked'>
you have
  <span style="font-size: 20px" :style="`color: ${hue};`">
    {{ format(amount, 2, 2) }}
  </span>
  {{ color.color.capitalize() }} Light

    <PrimaryButton style="height: 5rem;" @click="reset">
      {{isPrimary ? 'Split the Prism Energy' : 'Merge the beams'}} and gain {{ format(gain, 2, 2) }}
      {{ color.color.capitalize() }} Light
    </PrimaryButton>
    <br>
    <span>
      <DescriptionDisplay
        :config="config"
      />
      <EffectDisplay
        br
        :config="config"
      />
    </span>
    <br>
    <slot />
  </span>
  <span v-else style="font-size: 15px">
    {{ color.color.capitalize() }} Light
    <br>
    {{ lockedDescription }}
  </span>
  
  </div>
</template>

<style scoped>
.light {
  border: 2px white solid;
  border-radius: 0.4rem;
  background-color: #464646;
  height: 17rem;
  width: 30rem;
  align-content: center;
  padding: 2rem;
}
</style>
