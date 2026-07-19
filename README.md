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
  setupFile: '/.playground/.histoire/setup.ts',
  theme: {
    title: 'Rhapsodic UI',
  },
});
```

The preset uses Histoire's own configuration merge behavior: local values override defaults, nested
objects are merged, and ordinary local arrays replace defaults. Histoire merges its `plugins` array
by plugin name. The shared setup entry is pre-optimized so loading it does not restart story
collection. For complete control, use a callback:

```ts
export default defineHistoireKitNuxtConfig(defaults => ({
  ...defaults,
  plugins: [...(defaults.plugins ?? []), localPlugin()],
  outDir: 'local-histoire',
}));
```

The callback result is used as the final configuration, so every default can be extended, replaced,
or removed.

### Nuxt layer story discovery

A product can discover stories and optimizer entries from every layer resolved by its own
`nuxt.config.ts`:

```ts
import { defineHistoireKitNuxtConfig } from '@rhapsodic/histoire-kit/config/nuxt';

export default await defineHistoireKitNuxtConfig({
  discoverNuxtLayerStories: {
    prefixLayerStories: true,
    rootStoryPrefix: 'Product',
  },
  setupFile: '/.histoire/setup.ts',
  theme: {
    title: 'My Project',
  },
});
```

The explicit `discoverNuxtLayerStories: true` option enables story discovery from resolved Nuxt
layers. The kit loads `nuxt.config.ts` from the current working directory without preparing Nuxt,
excludes the root application from the resolved layer list, and uses these defaults:

- root stories: `.playground/.histoire/**/*.story.vue` and `app/**/*.story.vue`;
- stories inside every resolved layer: `app/**/*.story.vue`;
- optional layer optimizer entry: `histoire.optimize.ts`;
- the Histoire `setupFile`, normalized as a root optimizer entry.

`prefixLayerStories: true` places every discovered layer's stories under its uppercased Nuxt layer
name, falling back to the uppercased layer directory name. `rootStoryPrefix` independently places
only stories owned by the current project under the supplied prefix. It does not prefix
discovered-layer stories or Histoire's generated plugin stories. Both options are disabled by
default and preserve a local `tree.file` strategy.

Local filesystem layers and installed package layers work the same way because discovery uses each
layer's resolved `cwd`. Use `storyMatch` and `setupFile` for root configuration. Use
`discoverNuxtLayerStories.layerStoryMatch` and `discoverNuxtLayerStories.layerOptimizeEntry` for
layer conventions, and set `discoverNuxtLayerStories.layerOptimizeEntry: false` to disable
optimizer-entry discovery. The standalone
`resolveNuxtLayerHistoireConfig` export remains available from
`@rhapsodic/histoire-kit/config/nuxt-layers` for advanced composition, including its
`rootStoryMatch` option.

Pass an options object instead of `true` only when the defaults need adjustment. For example,
`discoverNuxtLayerStories: { cwd: '/another/project' }` overrides automatic root discovery when
Histoire is started outside the product directory.

#### Reusable UI layers

A reusable Nuxt UI layer provides Histoire stories by colocating `*.story.vue` files under its
`app` directory. Its own Histoire configuration can continue to use the ordinary root story glob.
When its stories need dependencies pre-bundled by Vite, the layer can add an optimizer entry:

```ts
// histoire.optimize.ts
import 'third-party-package-used-by-layer-stories';
```

The optimizer entry belongs to the layer because the layer owns those story dependencies. Products
then discover it automatically and remain independent of the layer's package name, filesystem
location, dependencies, and internal component paths.

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
    HstKitStoryWrapper: LocalStoryWrapper,
  },
  setup({ app }) {
    app.provide('project', projectContext);
  },
});
```

Use `components: false` to disable all global helper registration.
Set `HstKitStoryWrapper` to `false` to disable the default story padding.

## Components

The setup registers:

- `HstKitOverview` and `HstKitSection` for overview structure;
- `HstKitGroup`, `HstKitExamples`, and `HstKitExample` for flexible examples;
- `HstKitMatrix` and `HstKitMatrixRow` for aligned state comparisons;
- `HstKitLabel` for quiet workbench labels;
- `HstKitPreview` for constrained component previews.
- `HstKitStoryWrapper` for the default padded story canvas, applied automatically with
  Histoire's `addWrapper` setup API.

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
