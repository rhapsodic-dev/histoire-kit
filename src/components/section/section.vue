<template>
  <section :class="classNames">
    <component :is="headingTag" class="hst-kit-section__title">{{ title }}</component>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { useBMC } from '@rhapsodic/bem-classnames-vue';
import { computed } from 'vue';
import type { HstKitSectionProps } from '.';

defineOptions({
  name: 'HstKitSection',
});

const props = withDefaults(defineProps<HstKitSectionProps>(), {
  gap: 16,
  level: 2,
  size: 'default',
});

const classNames = useBMC(props, 'hst-kit-section', {
  size: true,
});

const gap = computed(() => `${props.gap}px`);
const headingTag = computed(() => `h${props.level}`);
</script>

<style scoped lang="scss">
.hst-kit-section {
  display: flex;
  flex-direction: column;
  gap: v-bind(gap);

  &__title {
    margin: 0;
    color: var(--hst-kit-text-primary, #f4f4f5);
    font-size: 15px;
    text-transform: capitalize;
  }

  &_size {
    &_large {
      .hst-kit-section__title {
        font-size: 18px;
      }
    }
  }
}
</style>
