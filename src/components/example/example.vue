<template>
  <div :class="classNames">
    <hst-kit-label>{{ label }}</hst-kit-label>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitExampleProps } from '.';

defineOptions({
  name: 'HstKitExample',
});

const props = withDefaults(defineProps<HstKitExampleProps>(), {
  align: 'start',
  width: undefined,
});

const classNames = useBMC(props, 'hst-kit-example', {
  align: true,
});

const width = computed(() => (props.width == null ? 'auto' : `${props.width}px`));
</script>

<style scoped lang="scss">
.hst-kit-example {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: v-bind(width);

  &_align {
    &_start {
      align-items: flex-start;
    }

    &_center {
      align-items: center;
    }
  }
}
</style>
