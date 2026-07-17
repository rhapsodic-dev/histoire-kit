<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { flag, useBMC } from '@rhapsodic/bem-classnames-vue';
import type { HstKitMatrixRowProps } from '.';

defineOptions({
  name: 'HstKitMatrixRow',
});

const props = withDefaults(defineProps<HstKitMatrixRowProps>(), {
  isHeader: false,
});

const classNames = useBMC(props, 'hst-kit-matrix-row', {
  isHeader: flag('state', 'header'),
});
</script>

<style scoped lang="scss">
.hst-kit-matrix-row {
  display: grid;
  grid-template-columns: var(--hst-kit-matrix-columns);
  gap: var(--hst-kit-matrix-column-gap);
  align-items: center;

  &_state_header {
    color: var(--hst-kit-text-muted, #a1a1aa);
    font-size: 12px;
    text-align: center;
  }
}
</style>
