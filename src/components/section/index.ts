export { default } from './section.vue';

export type HstKitSectionHeadingLevel = 2 | 3;
export type HstKitSectionSize = 'default' | 'large';

export interface HstKitSectionProps {
  gap?: number;
  level?: HstKitSectionHeadingLevel;
  size?: HstKitSectionSize;
  title: string;
}
