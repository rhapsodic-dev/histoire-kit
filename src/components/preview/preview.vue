<template>
  <div :class="classNames">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitPreviewProps, HstKitPreviewSize } from '.';

defineOptions({
  name: 'HstKitPreview',
});

const props = withDefaults(defineProps<HstKitPreviewProps>(), {
  height: 'auto',
  maxHeight: 'none',
  paddingBlock: 0,
  width: 'auto',
});

const classNames = useBMC(props, 'hst-kit-preview', {});

function toCssSize(value: HstKitPreviewSize): string {
  return typeof value === 'number' ? `${value}px` : value;
}

const height = computed(() => toCssSize(props.height));
const maxHeight = computed(() => toCssSize(props.maxHeight));
const paddingBlock = computed(() => toCssSize(props.paddingBlock));
const width = computed(() => toCssSize(props.width));
</script>

<style scoped lang="scss">
.hst-kit-preview {
  width: v-bind(width);
  height: v-bind(height);
  max-height: v-bind(maxHeight);
  padding-block: v-bind(paddingBlock);

  :deep(> *) {
    width: 100%;
    height: inherit;
    max-height: inherit;
  }
}
</style>
