import { describe, expect, it } from 'vitest';
import { createHistoireKitConfigDefaults } from '../../src/config';

describe('createHistoireKitConfigDefaults', () => {
  it('pre-optimizes the shared setup entry', () => {
    const config = createHistoireKitConfigDefaults();
    const viteConfig = typeof config.vite === 'function' ? undefined : config.vite;

    expect(viteConfig?.optimizeDeps?.include).toContain('@rhapsodic/histoire-kit/setup');
  });
});
