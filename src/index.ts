export type {
  HstKitExampleAlignment,
  HstKitExampleProps,
} from './components/example';
export type { HstKitExamplesProps } from './components/examples';
export type {
  HstKitGroupAlignment,
  HstKitGroupDirection,
  HstKitGroupProps,
} from './components/group';
export type { HstKitMatrixProps } from './components/matrix';
export type { HstKitMatrixRowProps } from './components/matrix-row';
export type { HstKitOverviewProps } from './components/overview';
export type {
  HstKitPreviewProps,
  HstKitPreviewSize,
} from './components/preview';
export type {
  HstKitSectionHeadingLevel,
  HstKitSectionProps,
  HstKitSectionSize,
} from './components/section';

declare module 'vue' {
  export interface GlobalComponents {
    HstKitExample: typeof import('./registration').HstKitExample;
    HstKitExamples: typeof import('./registration').HstKitExamples;
    HstKitGroup: typeof import('./registration').HstKitGroup;
    HstKitLabel: typeof import('./registration').HstKitLabel;
    HstKitMatrix: typeof import('./registration').HstKitMatrix;
    HstKitMatrixRow: typeof import('./registration').HstKitMatrixRow;
    HstKitOverview: typeof import('./registration').HstKitOverview;
    HstKitPreview: typeof import('./registration').HstKitPreview;
    HstKitSection: typeof import('./registration').HstKitSection;
  }
}

export {
  HstKitExample,
  HstKitExamples,
  HstKitGroup,
  HstKitLabel,
  HstKitMatrix,
  HstKitMatrixRow,
  HstKitOverview,
  HstKitPreview,
  HstKitSection,
} from './registration';
