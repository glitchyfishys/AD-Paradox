<script>
import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer";
import HeaderParadoxContainer from "./prestige-header/HeaderParadoxContainer";
import HeaderAbsurdityContainer from "./prestige-header/HeaderAbsurdityContainer";

export default {
  name: "HeaderPrestigeGroup",
  components: {
    HeaderCenterContainer,
    HeaderEternityContainer,
    HeaderInfinityContainer,
    HeaderParadoxContainer,
    HeaderAbsurdityContainer
  },
};
</script>

<template>
  <div class="c-prestige-info-blocks">
    <HeaderEternityContainer class="l-game-header__eternity" />
    <HeaderCenterContainer class="l-game-header__center" />
    <HeaderInfinityContainer class="l-game-header__infinity" />
    <HeaderParadoxContainer class="l-game-header__paradox" />
    <HeaderAbsurdityContainer class="l-game-header__absurdity" />
  </div>
</template>

<style scoped>
.c-prestige-info-blocks {
  display: flex;
  flex-direction: row;
  height: 14rem;
  width: 100%;
  color: var(--color-text);
}

.l-game-header__eternity {
  position: absolute;
  left: calc(25% - 22rem);
  width: 22rem;
}

.l-game-header__center {
  position: absolute;
  right: calc(50% - 25rem);
  width: 50rem;
}

.l-game-header__infinity {
  position: absolute;
  right: calc(25% - 22rem);
  width: 22rem;
}

.l-game-header__paradox {
  position: absolute;
  right: calc(25% - 22rem);
  width: 22rem;
  top: 9rem;
}

.l-game-header__absurdity {
  position: absolute;
  left: calc(25% - 22rem);
  width: 22rem;
  top: 9rem;
}
</style>
