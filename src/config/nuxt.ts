import { HstNuxt } from '@histoire/plugin-nuxt';
import { HstVue } from '@histoire/plugin-vue';
import {
  applyHistoireConfigCustomizer,
  createHistoireKitConfigDefaults,
} from '.';
import type { HistoireConfigCustomizer, HistoireUserConfig } from '.';
import { resolveNuxtLayerHistoireConfig } from './nuxt-layers';
import type { ResolveNuxtLayerHistoireConfigOptions } from './nuxt-layers';

type NuxtLayerStoryDiscoveryOptions = Omit<
  ResolveNuxtLayerHistoireConfigOptions,
  'cwd' | 'rootStoryMatch' | 'setupFile'
> & {
  cwd?: string;
};

export type HistoireKitNuxtConfigWithLayerStories = HistoireUserConfig & {
  discoverNuxtLayerStories: NuxtLayerStoryDiscoveryOptions | true;
};
type NuxtConfigInput = HistoireConfigCustomizer | HistoireKitNuxtConfigWithLayerStories;
type NuxtConfigResult = HistoireUserConfig | Promise<HistoireUserConfig>;

function createHistoireKitNuxtConfigDefaults(): HistoireUserConfig {
  return {
    ...createHistoireKitConfigDefaults(),
    plugins: [
      HstVue(),
      HstNuxt(),
    ],
  };
}

function normalizeSetupEntry(setupFile: unknown): string | undefined {
  if (typeof setupFile !== 'string') {
    return undefined;
  }

  return setupFile.replace(/^\/+/, '');
}

async function defineHistoireKitNuxtLayerStoryConfig(
  defaults: HistoireUserConfig,
  options: HistoireKitNuxtConfigWithLayerStories,
): Promise<HistoireUserConfig> {
  const { discoverNuxtLayerStories, ...customizer } = options;
  const layerOptions = discoverNuxtLayerStories === true ? {} : discoverNuxtLayerStories;
  const {
    layerOptimizeEntry,
    layerStoryMatch,
  } = layerOptions;
  const configuredRootStories = customizer.storyMatch ?? defaults.storyMatch;
  const configuredSetupFile = customizer.setupFile ?? defaults.setupFile;
  const layers = await resolveNuxtLayerHistoireConfig({
    cwd: layerOptions.cwd ?? process.cwd(),
    layerOptimizeEntry,
    layerStoryMatch,
    rootStoryMatch: configuredRootStories,
    setupFile: normalizeSetupEntry(configuredSetupFile),
  });
  const layerDefaults = applyHistoireConfigCustomizer(defaults, layers);

  return applyHistoireConfigCustomizer(layerDefaults, {
    ...customizer,
    storyMatch: layers.storyMatch,
  });
}

export function defineHistoireKitNuxtConfig(
  customizer: HistoireKitNuxtConfigWithLayerStories,
): Promise<HistoireUserConfig>;
export function defineHistoireKitNuxtConfig(customizer?: HistoireConfigCustomizer): HistoireUserConfig;
export function defineHistoireKitNuxtConfig(customizer: NuxtConfigInput = {}): NuxtConfigResult {
  const defaults = createHistoireKitNuxtConfigDefaults();

  if (typeof customizer !== 'function' && 'discoverNuxtLayerStories' in customizer) {
    return defineHistoireKitNuxtLayerStoryConfig(defaults, customizer);
  }

  return applyHistoireConfigCustomizer(defaults, customizer);
}
