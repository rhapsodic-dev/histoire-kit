import { HstNuxt } from '@histoire/plugin-nuxt';
import { HstVue } from '@histoire/plugin-vue';
import {
  applyHistoireConfigCustomizer,
  createHistoireKitConfigDefaults,
} from '.';
import type { HistoireConfigCustomizer, HistoireUserConfig } from '.';

export function defineHistoireKitNuxtConfig(customizer: HistoireConfigCustomizer = {}): HistoireUserConfig {
  const defaults = {
    ...createHistoireKitConfigDefaults(),
    plugins: [
      HstVue(),
      HstNuxt(),
    ],
  };

  return applyHistoireConfigCustomizer(defaults, customizer);
}
