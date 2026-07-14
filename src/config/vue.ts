import { HstVue } from '@histoire/plugin-vue';
import {
  applyHistoireConfigCustomizer,
  createHistoireKitConfigDefaults,
} from '.';
import type { HistoireConfigCustomizer, HistoireUserConfig } from '.';

export function defineHistoireKitVueConfig(customizer: HistoireConfigCustomizer = {}): HistoireUserConfig {
  const defaults = {
    ...createHistoireKitConfigDefaults(),
    plugins: [HstVue()],
  };

  return applyHistoireConfigCustomizer(defaults, customizer);
}
