import { defineSetupVue3 } from '@histoire/plugin-vue';
import type { Vue3StorySetupHandler } from '@histoire/plugin-vue';
import { installHistoireKit } from './registration';
import type { HistoireKitInstallOptions } from './registration';

export interface HistoireKitSetupOptions extends HistoireKitInstallOptions {
  setup?: Vue3StorySetupHandler;
}

type HistoireKitSetupInput = HistoireKitSetupOptions | Vue3StorySetupHandler;

export function defineHistoireKitSetup(optionsOrSetup: HistoireKitSetupInput = {}): Vue3StorySetupHandler {
  const options = typeof optionsOrSetup === 'function'
    ? { setup: optionsOrSetup }
    : optionsOrSetup;

  return defineSetupVue3(async (context) => {
    const components = installHistoireKit(context.app, options);

    const storyWrapper = components?.HstKitStoryWrapper;
    if (storyWrapper) {
      context.addWrapper(storyWrapper);
    }

    await options.setup?.(context);
  });
}
