import { loadNuxtConfig } from '@nuxt/kit';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_STORY_MATCH = 'app/**/*.story.vue';
const DEFAULT_LAYER_OPTIMIZE_ENTRY = 'histoire.optimize.ts';

export interface ResolveNuxtLayerHistoireConfigOptions {
  cwd: string;
  layerOptimizeEntry?: string | false;
  layerStoryMatch?: string;
  rootStoryMatch?: string[];
  setupFile?: string;
}

export interface ResolvedNuxtLayerHistoireConfig {
  storyMatch: string[];
  vite: {
    optimizeDeps: {
      entries: string[];
    };
  };
}

type ResolverOptions = ResolveNuxtLayerHistoireConfigOptions;
type ResolverResult = Promise<ResolvedNuxtLayerHistoireConfig>;

export async function resolveNuxtLayerHistoireConfig(options: ResolverOptions): ResolverResult {
  const nuxtConfig = await loadNuxtConfig({
    cwd: options.cwd,
    overrides: {
      _prepare: false,
    },
  });

  const layers = nuxtConfig._layers.slice(1);
  const rootStoryMatch = options.rootStoryMatch ?? [DEFAULT_STORY_MATCH];
  const layerStoryMatch = options.layerStoryMatch ?? DEFAULT_STORY_MATCH;
  const layerOptimizeEntry = options.layerOptimizeEntry ?? DEFAULT_LAYER_OPTIMIZE_ENTRY;

  const layerStories = layers.map((layer) => path.join(layer.cwd, layerStoryMatch));
  const layerOptimizeEntries = layerOptimizeEntry === false
    ? []
    : layers
        .map((layer) => path.join(layer.cwd, layerOptimizeEntry))
        .filter((entry) => existsSync(entry));

  return {
    storyMatch: [
      ...rootStoryMatch,
      ...layerStories,
    ],
    vite: {
      optimizeDeps: {
        entries: [
          ...(options.setupFile ? [options.setupFile] : []),
          ...rootStoryMatch,
          ...layerOptimizeEntries,
        ],
      },
    },
  };
}
