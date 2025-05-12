<script>
import ParadoxAchievementRow from "./ParadoxAchievementRow";

export default {
  name: "ParadoxAchievementTab",
  components: {
    ParadoxAchievementRow
  },
  computed: {
    rows: () => ParadoxAchievements.allRows,
  }
};
</script>

<template>
  <div class="l-achievements-tab">
    <div class="c-achievements-tab__header">
      <span>
        There is a {{ formatPow(0.2,1,1) }} Nerf to most things
      </span>
    </div>
    <div class="l-achievement-grid">
      <paradox-achievement-row
        v-for="(row, i) in rows"
        :key="i"
        :row="row"
      />
    </div>
  </div>
</template>
