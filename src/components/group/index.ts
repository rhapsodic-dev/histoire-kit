export { default } from './group.vue';

export type HstKitGroupAlignment = 'start' | 'center';
export type HstKitGroupDirection = 'horizontal' | 'vertical';

export interface HstKitGroupProps {
  align?: HstKitGroupAlignment;
  direction?: HstKitGroupDirection;
  gap?: number;
  tag?: string;
}
