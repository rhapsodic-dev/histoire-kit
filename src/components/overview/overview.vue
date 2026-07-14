<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitOverviewProps } from '.';

defineOptions({
  name: 'HstKitOverview',
});

const props = withDefaults(defineProps<HstKitOverviewProps>(), {
  gap: 40,
});

const classNames = useBMC(props, 'hst-kit-overview', {});

const gap = computed(() => `${props.gap}px`);
</script>

<style scoped lang="scss">
.hst-kit-overview {
  display: flex;
  flex-direction: column;
  gap: v-bind(gap);
}
</style>
