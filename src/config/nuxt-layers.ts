import { loadNuxtConfig } from '@nuxt/kit';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_STORY_MATCH = 'app/**/*.story.vue';
const DEFAULT_LAYER_OPTIMIZE_ENTRY = 'histoire.optimize.ts';

export interface HistoireStoryTreeFile {
  path: string;
  title: string;
}

export type HistoireStoryTreeFileResolver
  = | 'path'
    | 'title'
    | ((file: HistoireStoryTreeFile) => string[]);

export interface ResolveNuxtLayerHistoireConfigOptions {
  cwd: string;
  layerOptimizeEntry?: string | false;
  layerStoryMatch?: string;
  prefixLayerStories?: boolean;
  rootStoryMatch?: string[];
  rootStoryPrefix?: string;
  setupFile?: string;
  treeFile?: HistoireStoryTreeFileResolver;
}

export interface ResolvedNuxtLayerHistoireConfig {
  storyMatch: string[];
  tree?: {
    file: (file: HistoireStoryTreeFile) => string[];
  };
  vite: {
    optimizeDeps: {
      entries: string[];
    };
  };
}

type ResolverOptions = ResolveNuxtLayerHistoireConfigOptions;
type ResolverResult = Promise<ResolvedNuxtLayerHistoireConfig>;

interface LayerStorySource {
  directory: string;
  name: string;
}

function normalizeTreePath(filePath: string): string {
  return filePath.replaceAll('\\', '/').replace(/\/$/, '');
}

function resolveBaseTreePath(
  file: HistoireStoryTreeFile,
  treeFile: HistoireStoryTreeFileResolver = 'title',
): string[] {
  if (typeof treeFile === 'function') {
    return treeFile(file);
  }

  if (treeFile === 'path') {
    const pathSegments = normalizeTreePath(file.path).split('/')
      .slice(0, -1);
    const pluginSegmentIndex = pathSegments.findIndex((segment) => segment.includes('.histoire'));

    return pluginSegmentIndex === -1
      ? [...pathSegments, file.title]
      : ['plugins', file.title];
  }

  return file.title.split('/');
}

function addTreePrefix(treePath: string[], prefix?: string): string[] {
  const normalizedPrefix = prefix?.trim();

  if (!normalizedPrefix || treePath[0] === normalizedPrefix) {
    return treePath;
  }

  return [normalizedPrefix, ...treePath];
}

function createPrefixedTreeFileResolver(
  options: ResolverOptions,
  layerSources: LayerStorySource[],
): ((file: HistoireStoryTreeFile) => string[]) | undefined {
  if (!options.prefixLayerStories && !options.rootStoryPrefix) {
    return undefined;
  }

  return (file) => {
    const filePath = normalizeTreePath(file.path);
    const treePath = resolveBaseTreePath(file, options.treeFile);
    const layer = layerSources.find((source) => (
      filePath === source.directory || filePath.startsWith(`${source.directory}/`)
    ));

    if (layer) {
      const layerPrefix = options.prefixLayerStories ? layer.name.toUpperCase() : undefined;

      return addTreePrefix(treePath, layerPrefix);
    }

    const isGeneratedPluginStory = filePath.startsWith('node_modules/.histoire/');
    const isProjectStory = !filePath.startsWith('../') && !isGeneratedPluginStory;

    return addTreePrefix(treePath, isProjectStory ? options.rootStoryPrefix : undefined);
  };
}

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
  const layerSources = layers
    .map((layer) => ({
      directory: normalizeTreePath(path.relative(options.cwd, layer.cwd)),
      name: layer.meta?.name?.trim() ?? path.basename(layer.cwd),
    }))
    .toSorted((left, right) => right.directory.length - left.directory.length);
  const layerOptimizeEntries = layerOptimizeEntry === false
    ? []
    : layers
        .map((layer) => path.join(layer.cwd, layerOptimizeEntry))
        .filter((entry) => existsSync(entry));
  const treeFile = createPrefixedTreeFileResolver(options, layerSources);

  return {
    storyMatch: [
      ...rootStoryMatch,
      ...layerStories,
    ],
    ...treeFile && {
      tree: {
        file: treeFile,
      },
    },
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
