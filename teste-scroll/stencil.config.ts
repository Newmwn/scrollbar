import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
const angularValueAccessorBindings: ValueAccessorConfig[] = [];

export const config: Config = {
  namespace: 'nc-devkit',
  enableCache: false,
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: './loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    react({
      componentCorePackage: '@niup/devkit',
      loaderDir: 'loader',
      proxiesFile: './../nc-react-devkit/nc-devkit/src/components/stencil-generated/proxies.ts',
      includeDefineCustomElements: true,
      excludeComponents: ['component-devkit-test'],
    }),
    angularOutputTarget({
      componentCorePackage: '@niup/devkit',
      outputType: 'component',
      directivesProxyFile: './../nc-angular-devkit/projects/nc-devkit/src/libs/stencil-generated/proxies.ts',
      directivesArrayFile: './../nc-angular-devkit/projects/nc-devkit/src/libs/stencil-generated/index.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
      excludeComponents: ['component-devkit-test'],
    }),
  ],
  plugins: [sass()],
};
