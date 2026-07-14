export { default } from './preview.vue';

export type HstKitPreviewSize = number | string;

export interface HstKitPreviewProps {
  height?: HstKitPreviewSize;
  maxHeight?: HstKitPreviewSize;
  paddingBlock?: HstKitPreviewSize;
  width?: HstKitPreviewSize;
}
