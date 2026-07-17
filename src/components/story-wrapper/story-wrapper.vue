<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';

defineOptions({
  name: 'HstKitStoryWrapper',
});

const classNames = useBMC({}, 'hst-kit-story-wrapper', {});
</script>

<style scoped lang="scss">
.hst-kit-story-wrapper {
  padding: 16px;
}
</style>
