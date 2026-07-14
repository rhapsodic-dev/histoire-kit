<template>
  <span :class="classNames"><slot /></span>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';

defineOptions({
  name: 'HstKitLabel',
});

const classNames = useBMC({}, 'hst-kit-label', {});
</script>

<style scoped lang="scss">
.hst-kit-label {
  color: var(--hst-kit-text-muted, var(--rui-text-muted, #a1a1aa));
  font-size: 13px;
  text-transform: capitalize;
}
</style>
