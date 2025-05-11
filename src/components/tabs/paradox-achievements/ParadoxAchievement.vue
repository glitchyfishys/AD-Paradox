<script>
import HintText from "@/components/HintText";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "ParadoxAchievement",
  components: {
    HintText,
    EffectDisplay
  },
  props: {
    achievement: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isMouseOver: false,
      showUnlockState: false
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    config() {
      return this.achievement.config;
    },
    styleObject() {
      return {
        "background-position": `-${(this.achievement.column - 1) * 104}px -${(this.achievement.row - 1) * 104}px`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--paradox": true,
        "o-achievement--disabled": this.isDisabled,
        "o-achievement--locked": !this.isUnlocked && !this.isDisabled,
        "o-achievement--unlocked": this.isUnlocked,
      };
    },
    rewardClassObject() {
      return {
        "o-achievement__reward": true,
        "o-achievement__reward--disabled": this.isDisabled,
        "o-achievement__reward--locked": !this.isUnlocked && !this.isDisabled,
      };
    },
    hasReward() {
      return this.config.reward !== undefined && !this.isObscured;
    },
    indicatorIconClass() {
      return this.isUnlocked ? "fas fa-check" : "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--locked": !this.isUnlocked
      };
    },
  },
  beforeDestroy() {
    clearTimeout(this.mouseOverInterval);
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      this.showUnlockState = player.options.showHintText.achievementUnlockStates;
    },
    onMouseEnter() {
      clearTimeout(this.mouseOverInterval);
      this.isMouseOver = true;
    },
    onMouseLeave() {
      this.mouseOverInterval = setTimeout(() => this.isMouseOver = false, 300);
    }
  }
};
</script>

<template>
  <div
    :class="classObject"
    :style="styleObject"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <HintText
      type="achievements"
      class="l-hint-text--achievement"
    >
      P{{ id }}
    </HintText>
    <div class="o-achievement__tooltip">
      <template v-if="isMouseOver">
        <div class="o-achievement__tooltip__name">
          {{ config.name }} (P{{ id }})
        </div>
        <div
          class="o-achievement__tooltip__description"
        >
          {{ config.description }}
          <div
          v-if="config.reward"
          class="o-achievement__tooltip__reward"
        >
            Reward: {{ config.reward }}
            <EffectDisplay
              v-if="config.formatEffect"
              br
              :config="config"
            />
        </div>
        </div>
      </template>
    </div>
    <div
      v-if="showUnlockState"
      :class="indicatorClassObject"
    >
      <i :class="indicatorIconClass" />
    </div>
    <div
      v-if="hasReward"
      :class="rewardClassObject"
    >
      <i class="fas fa-star" />
    </div>
  </div>
</template>

<style scoped>
.o-achievement--disabled {
  background-color: var(--color-pelle--base);
  border-color: var(--color-bad);
}

.o-achievement--locked {
  background-color: #a3a3a3;
  border-color: var(--color-bad);
}

.o-achievement__reward {
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 1rem;
  color: black;
  background: #5ac467;
  border-top: var(--var-border-width, 0.2rem) solid #127a20;
  border-right: var(--var-border-width, 0.2rem) solid #127a20;
  border-top-right-radius: var(--var-border-radius, 0.8rem);
  border-bottom-left-radius: var(--var-border-radius, 0.6rem);
}

.o-achievement__reward--locked {
  background: #f3a3f3;
  border-color: var(--color-bad);
}

.o-achievement__reward--disabled {
  background: var(--color-pelle--base);
  border-color: var(--color-bad);
}
</style>