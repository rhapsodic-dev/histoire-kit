import type { PathLike } from 'node:fs';
import path from 'node:path';
import {
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import { defineHistoireKitNuxtConfig } from '../../src/config/nuxt';
import { resolveNuxtLayerHistoireConfig } from '../../src/config/nuxt-layers';

type LoadNuxtConfig = typeof import('@nuxt/kit').loadNuxtConfig;
type NuxtConfig = Awaited<ReturnType<LoadNuxtConfig>>;
type MockNuxtLayer = string | {
  directory: string;
  name?: string;
};

const mocks = vi.hoisted(() => ({
  existsSync: vi.fn<(path: PathLike) => boolean>(),
  loadNuxtConfig: vi.fn<LoadNuxtConfig>(),
}));

vi.mock('@nuxt/kit', () => ({
  loadNuxtConfig: mocks.loadNuxtConfig,
}));

vi.mock('node:fs', () => ({
  existsSync: mocks.existsSync,
}));

function mockNuxtLayers(...layers: MockNuxtLayer[]): void {
  mocks.loadNuxtConfig.mockResolvedValue({
    _layers: layers.map((layer) => (typeof layer === 'string'
      ? { cwd: layer }
      : {
          cwd: layer.directory,
          meta: layer.name ? { name: layer.name } : undefined,
        })),
  } as unknown as NuxtConfig);
}

describe('resolveNuxtLayerHistoireConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('keeps root defaults and loads Nuxt without preparation', async () => {
    mockNuxtLayers('/product');

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
    });

    expect(config).toEqual({
      storyMatch: ['app/**/*.story.vue'],
      vite: {
        optimizeDeps: {
          entries: ['app/**/*.story.vue'],
        },
      },
    });
    expect(mocks.loadNuxtConfig).toHaveBeenCalledWith({
      cwd: '/product',
      overrides: {
        _prepare: false,
      },
    });
    expect(mocks.existsSync).not.toHaveBeenCalled();
  });

  it('adds stories and an existing optimizer entry from a local layer', async () => {
    const layerDirectory = '/product/layers/local-ui';
    const optimizeEntry = path.join(layerDirectory, 'histoire.optimize.ts');

    mockNuxtLayers('/product', layerDirectory);
    mocks.existsSync.mockReturnValue(true);

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      setupFile: '.histoire/setup.ts',
    });

    expect(config.storyMatch).toEqual([
      'app/**/*.story.vue',
      path.join(layerDirectory, 'app/**/*.story.vue'),
    ]);
    expect(config.vite.optimizeDeps.entries).toEqual([
      '.histoire/setup.ts',
      'app/**/*.story.vue',
      optimizeEntry,
    ]);
  });

  it('supports multiple local and package-like layers and ignores missing optimizer entries', async () => {
    const localLayer = '/product/layers/local-ui';
    const packageLayer = '/product/node_modules/@scope/ui';
    const layerWithoutOptimizer = '/product/node_modules/@scope/other-ui';
    const existingEntries = new Set([
      path.join(localLayer, 'histoire.optimize.ts'),
      path.join(packageLayer, 'histoire.optimize.ts'),
    ]);

    mockNuxtLayers('/product', localLayer, packageLayer, layerWithoutOptimizer);
    mocks.existsSync.mockImplementation((entryPath) => existingEntries.has(entryPath.toString()));

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
    });

    expect(config.storyMatch).toEqual([
      'app/**/*.story.vue',
      path.join(localLayer, 'app/**/*.story.vue'),
      path.join(packageLayer, 'app/**/*.story.vue'),
      path.join(layerWithoutOptimizer, 'app/**/*.story.vue'),
    ]);
    expect(config.vite.optimizeDeps.entries).toEqual([
      'app/**/*.story.vue',
      ...existingEntries,
    ]);
  });

  it('can disable layer optimizer entry discovery', async () => {
    mockNuxtLayers('/product', '/product/layers/local-ui');

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      layerOptimizeEntry: false,
    });

    expect(config.vite.optimizeDeps.entries).toEqual(['app/**/*.story.vue']);
    expect(mocks.existsSync).not.toHaveBeenCalled();
  });

  it('supports custom root stories, layer stories, setup, and optimizer conventions', async () => {
    const layerDirectory = '/product/layers/local-ui';
    const optimizeEntry = path.join(layerDirectory, 'histoire.dependencies.ts');

    mockNuxtLayers('/product', layerDirectory);
    mocks.existsSync.mockReturnValue(true);

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      layerOptimizeEntry: 'histoire.dependencies.ts',
      layerStoryMatch: 'stories/**/*.story.vue',
      rootStoryMatch: [
        'stories/**/*.story.vue',
        'docs/**/*.story.vue',
      ],
      setupFile: '.workbench/setup.ts',
    });

    expect(config.storyMatch).toEqual([
      'stories/**/*.story.vue',
      'docs/**/*.story.vue',
      path.join(layerDirectory, 'stories/**/*.story.vue'),
    ]);
    expect(config.vite.optimizeDeps.entries).toEqual([
      '.workbench/setup.ts',
      'stories/**/*.story.vue',
      'docs/**/*.story.vue',
      optimizeEntry,
    ]);
  });

  it('prefixes layer stories without prefixing root stories', async () => {
    mockNuxtLayers(
      '/product',
      {
        directory: '/product/layers/local-ui',
        name: 'Local UI',
      },
      '/shared/forms',
    );

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      prefixLayerStories: true,
    });
    const treeFile = config.tree?.file;

    expect(treeFile).toBeTypeOf('function');
    expect(treeFile?.({
      path: 'app/components/button/button.story.vue',
      title: 'Buttons/Button',
    })).toEqual(['Buttons', 'Button']);
    expect(treeFile?.({
      path: 'layers/local-ui/app/components/button/button.story.vue',
      title: 'Buttons/Button',
    })).toEqual(['LOCAL UI', 'Buttons', 'Button']);
    expect(treeFile?.({
      path: '../shared/forms/app/components/input/input.story.vue',
      title: 'Forms/Input',
    })).toEqual(['FORMS', 'Forms', 'Input']);
  });

  it('does not apply the root prefix to layers, external files, or generated plugin stories', async () => {
    mockNuxtLayers('/product', '/product/layers/local-ui');

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      rootStoryPrefix: 'Processor',
    });
    const treeFile = config.tree?.file;

    expect(treeFile?.({
      path: '.playground/.histoire/overview.story.vue',
      title: 'Overview',
    })).toEqual(['Processor', 'Overview']);
    expect(treeFile?.({
      path: 'layers/local-ui/app/components/button/button.story.vue',
      title: 'Buttons/Button',
    })).toEqual(['Buttons', 'Button']);
    expect(treeFile?.({
      path: '../other-project/example.story.vue',
      title: 'Example',
    })).toEqual(['Example']);
    expect(treeFile?.({
      path: 'node_modules/.histoire/plugins/nuxt/client.story.js',
      title: 'Nuxt',
    })).toEqual(['Nuxt']);
  });

  it('composes prefixes with a custom tree file resolver', async () => {
    mockNuxtLayers('/product', {
      directory: '/product/layers/local-ui',
      name: 'Local UI',
    });

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      prefixLayerStories: true,
      rootStoryPrefix: 'Product',
      treeFile: (file) => ['Components', file.title],
    });
    const treeFile = config.tree?.file;

    expect(treeFile?.({
      path: 'app/components/button/button.story.vue',
      title: 'Button',
    })).toEqual(['Product', 'Components', 'Button']);
    expect(treeFile?.({
      path: 'layers/local-ui/app/components/button/button.story.vue',
      title: 'Button',
    })).toEqual(['LOCAL UI', 'Components', 'Button']);
  });

  it('preserves the built-in path tree strategy', async () => {
    mockNuxtLayers('/product', '/product/layers/local-ui');

    const config = await resolveNuxtLayerHistoireConfig({
      cwd: '/product',
      prefixLayerStories: true,
      rootStoryPrefix: 'Product',
      treeFile: 'path',
    });
    const treeFile = config.tree?.file;

    expect(treeFile?.({
      path: 'app/components/button/button.story.vue',
      title: 'Button',
    })).toEqual(['Product', 'app', 'components', 'button', 'Button']);
    expect(treeFile?.({
      path: 'node_modules/.histoire/plugins/nuxt/client.story.js',
      title: 'Nuxt',
    })).toEqual(['plugins', 'Nuxt']);
  });

  it('loads layers and merges overrides through one defineHistoireKitNuxtConfig call', async () => {
    mockNuxtLayers('/product', '/product/layers/local-ui');
    mocks.existsSync.mockReturnValue(false);

    const config = await defineHistoireKitNuxtConfig({
      discoverNuxtLayerStories: true,
      setupFile: '/.histoire/setup.ts',
      storyMatch: ['stories/**/*.story.vue'],
      theme: {
        title: 'Product',
      },
    });
    const viteConfig = typeof config.vite === 'function'
      ? await config.vite({}, { command: 'serve', mode: 'test' })
      : config.vite;

    expect(config.storyMatch).toEqual([
      'stories/**/*.story.vue',
      path.join('/product/layers/local-ui', 'app/**/*.story.vue'),
    ]);
    expect(config.setupFile).toBe('/.histoire/setup.ts');
    expect(config.theme?.title).toBe('Product');
    expect(viteConfig?.optimizeDeps?.entries).toEqual([
      '.histoire/setup.ts',
      'stories/**/*.story.vue',
    ]);
    expect(viteConfig?.optimizeDeps?.include).toContain('@rhapsodic/histoire-kit/setup');
    expect(config.plugins).toHaveLength(2);
    expect(mocks.loadNuxtConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
      overrides: {
        _prepare: false,
      },
    });
  });

  it('composes story prefixes with tree customization through the Nuxt helper', async () => {
    mockNuxtLayers('/product', {
      directory: '/product/layers/local-ui',
      name: 'Local UI',
    });
    mocks.existsSync.mockReturnValue(false);

    const config = await defineHistoireKitNuxtConfig({
      discoverNuxtLayerStories: {
        cwd: '/product',
        prefixLayerStories: true,
        rootStoryPrefix: 'Product',
      },
      tree: {
        file: (file) => ['Components', file.title],
      },
    });
    const treeFile = config.tree?.file;

    expect(treeFile).toBeTypeOf('function');
    expect(typeof treeFile === 'function' && treeFile({
      path: 'app/components/button/button.story.vue',
      title: 'Button',
    })).toEqual(['Product', 'Components', 'Button']);
    expect(typeof treeFile === 'function' && treeFile({
      path: 'layers/local-ui/app/components/button/button.story.vue',
      title: 'Button',
    })).toEqual(['LOCAL UI', 'Components', 'Button']);
  });

  it('preserves synchronous callback customization when layer discovery is not enabled', () => {
    const config = defineHistoireKitNuxtConfig((defaults) => ({
      ...defaults,
      outDir: 'custom-histoire',
      theme: {
        ...defaults.theme,
        title: 'Customized',
      },
    }));

    expect(config.outDir).toBe('custom-histoire');
    expect(config.theme?.title).toBe('Customized');
    expect(config.plugins).toHaveLength(2);
    expect(mocks.loadNuxtConfig).not.toHaveBeenCalled();
  });
});
