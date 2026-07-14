<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitExamplesProps } from '.';

defineOptions({
  name: 'HstKitExamples',
});

const props = withDefaults(defineProps<HstKitExamplesProps>(), {
  gap: 24,
});

const classNames = useBMC(props, 'hst-kit-examples', {});

const gap = computed(() => `${props.gap}px`);
</script>

<style scoped lang="scss">
.hst-kit-examples {
  display: flex;
  flex-wrap: wrap;
  gap: v-bind(gap);
  align-items: flex-start;
}
</style>
