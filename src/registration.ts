import type { App, Component } from 'vue';
import HstKitExample from './components/example';
import HstKitExamples from './components/examples';
import HstKitGroup from './components/group';
import HstKitLabel from './components/label';
import HstKitMatrix from './components/matrix';
import HstKitMatrixRow from './components/matrix-row';
import HstKitOverview from './components/overview';
import HstKitPreview from './components/preview';
import HstKitSection from './components/section';

const components = {
  HstKitExample,
  HstKitExamples,
  HstKitGroup,
  HstKitLabel,
  HstKitMatrix,
  HstKitMatrixRow,
  HstKitOverview,
  HstKitPreview,
  HstKitSection,
} as const;

export type HistoireKitComponentOverrides = Partial<Record<
  keyof typeof components,
  Component | false
>>;

export interface HistoireKitInstallOptions {
  components?: HistoireKitComponentOverrides | false;
}

export function installHistoireKit(
  app: App,
  options: HistoireKitInstallOptions = {},
): void {
  if (options.components === false) {
    return;
  }

  const configuredComponents: Record<string, Component | false> = {
    ...components,
    ...options.components,
  };

  for (const [name, component] of Object.entries(configuredComponents)) {
    if (component !== false) {
      app.component(name, component);
    }
  }
}

export { default as HstKitExample } from './components/example';
export { default as HstKitExamples } from './components/examples';
export { default as HstKitGroup } from './components/group';
export { default as HstKitLabel } from './components/label';
export { default as HstKitMatrix } from './components/matrix';
export { default as HstKitMatrixRow } from './components/matrix-row';
export { default as HstKitOverview } from './components/overview';
export { default as HstKitPreview } from './components/preview';
export { default as HstKitSection } from './components/section';
