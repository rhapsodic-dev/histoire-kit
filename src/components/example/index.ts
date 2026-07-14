export { default } from './example.vue';

export type HstKitExampleAlignment = 'start' | 'center';

export interface HstKitExampleProps {
  align?: HstKitExampleAlignment;
  label: string;
  width?: number;
}
