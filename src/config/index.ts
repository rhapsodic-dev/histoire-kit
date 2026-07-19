import { defaultColors, defineConfig, mergeConfig } from 'histoire';

export type HistoireUserConfig = Parameters<typeof defineConfig>[0];
export type HistoireConfigCustomizer = HistoireUserConfig
  | ((defaults: HistoireUserConfig) => HistoireUserConfig);

export function createHistoireKitConfigDefaults(): HistoireUserConfig {
  return {
    defaultStoryProps: {
      layout: {
        type: 'single',
        iframe: true,
      },
    },
    outDir: 'histoire-static',
    setupFile: '/.histoire/setup.ts',
    storyIgnored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.playground/.nuxt/**',
      '**/.playground/.output/**',
    ],
    storyMatch: [
      '.playground/.histoire/**/*.story.vue',
      'app/**/*.story.vue',
    ],
    theme: {
      title: 'Rhapsodic',
      colors: {
        gray: { ...defaultColors.zinc },
        primary: { ...defaultColors.orange },
      },
    },
  };
}

export function applyHistoireConfigCustomizer(
  defaults: HistoireUserConfig,
  customizer: HistoireConfigCustomizer = {},
): HistoireUserConfig {
  const config = typeof customizer === 'function'
    ? customizer(defaults)
    : mergeConfig(customizer, defaults);

  return defineConfig(config);
}
