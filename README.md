# Histoire kit

Composable Histoire configuration, setup, and story-presentation helpers for Rhapsodic projects.

The kit supplies useful defaults without owning a project's Histoire configuration. Object
overrides are merged after the defaults, callback customizers can replace the complete result, and
project setup always runs after shared setup.

## Install

For a Nuxt project:

```sh
pnpm add -D @rhapsodic/histoire-kit histoire @histoire/plugin-vue @histoire/plugin-nuxt
pnpm add --config @rhapsodic/pnpm-plugin-histoire-patches
```

For a Vue project, omit `@histoire/plugin-nuxt`.

## Configuration

Use the framework-specific preset and pass ordinary Histoire configuration as an override:

```ts
import { defineHistoireKitNuxtConfig } from '@rhapsodic/histoire-kit/config/nuxt';

export default defineHistoireKitNuxtConfig({
  storyMatch: [
    '.playground/.histoire/**/*.story.vue',
    'app/**/*.story.vue',
  ],
  setupFile: '/.playground/.histoire/setup.ts',
  theme: {
    title: 'Rhapsodic UI',
  },
});
```

The preset uses Histoire's own configuration merge behavior: local values override defaults, nested
objects are merged, and ordinary local arrays replace defaults. Histoire merges its `plugins` array
by plugin name. For complete control, use a callback:

```ts
export default defineHistoireKitNuxtConfig(defaults => ({
  ...defaults,
  plugins: [...(defaults.plugins ?? []), localPlugin()],
  outDir: 'local-histoire',
}));
```

The callback result is used as the final configuration, so every default can be extended, replaced,
or removed.

## Setup

Create a small project-owned setup file:

```ts
import { defineHistoireKitSetup } from '@rhapsodic/histoire-kit/setup';

export const setupVue3 = defineHistoireKitSetup(({ app }) => {
  app.use(projectPlugin);
});
```

The kit registers its components first and then runs the local callback. Registering the same name
inside the callback replaces the shared component.

Components can also be replaced or disabled declaratively:

```ts
export const setupVue3 = defineHistoireKitSetup({
  components: {
    HstKitLabel: LocalLabel,
    HstKitPreview: false,
  },
  setup({ app }) {
    app.provide('project', projectContext);
  },
});
```

Use `components: false` to disable all global helper registration.

## Components

The setup registers:

- `HstKitOverview` and `HstKitSection` for overview structure;
- `HstKitGroup`, `HstKitExamples`, and `HstKitExample` for flexible examples;
- `HstKitMatrix` and `HstKitMatrixRow` for aligned state comparisons;
- `HstKitLabel` for quiet workbench labels;
- `HstKitPreview` for constrained component previews.

Every component is also available as a named export from `@rhapsodic/histoire-kit`.
Its named `HstKit*Props` contract is exported from the package root when the component accepts props.

The presentation components use neutral fallbacks and support local token overrides:

```css
:root {
  --hst-kit-text-primary: var(--project-text-primary);
  --hst-kit-text-muted: var(--project-text-muted);
}
```

## Releases

Run `pnpm release`. Bumpp updates the version, creates a conventional release commit and lightweight
tag, and pushes both. The tag workflow creates a GitHub release and publishes to npm using trusted
publishing.
