<template>
  <component
    :is="tag"
    :class="classNames"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitGroupProps } from '.';

defineOptions({
  name: 'HstKitGroup',
});

const props = withDefaults(defineProps<HstKitGroupProps>(), {
  align: 'start',
  direction: 'horizontal',
  gap: 20,
  tag: 'div',
});

const classNames = useBMC(props, 'hst-kit-group', {
  align: true,
  direction: true,
});

const gap = computed(() => `${props.gap}px`);
</script>

<style scoped lang="scss">
.hst-kit-group {
  display: flex;
  gap: v-bind(gap);

  &_align {
    &_start {
      align-items: flex-start;
    }

    &_center {
      align-items: center;
    }
  }

  &_direction {
    &_horizontal {
      flex-direction: row;
    }

    &_vertical {
      flex-direction: column;
    }
  }
}
</style>
