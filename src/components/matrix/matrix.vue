<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitMatrixProps } from '.';

defineOptions({
  name: 'HstKitMatrix',
});

const props = withDefaults(defineProps<HstKitMatrixProps>(), {
  columns: '100px repeat(2, max-content)',
  gap: 16,
  rowGap: 12,
});

const classNames = useBMC(props, 'hst-kit-matrix', {});

const columnGap = computed(() => `${props.gap}px`);
const columns = computed(() => props.columns);
const rowGap = computed(() => `${props.rowGap}px`);
</script>

<style scoped lang="scss">
.hst-kit-matrix {
  --hst-kit-matrix-columns: v-bind(columns);
  --hst-kit-matrix-column-gap: v-bind(columnGap);

  display: grid;
  grid-template-columns: var(--hst-kit-matrix-columns);
  gap: v-bind(rowGap) var(--hst-kit-matrix-column-gap);
  place-items: center start;

  :deep(.hst-kit-matrix-row_header > *) {
    justify-self: stretch;
  }
}
</style>
