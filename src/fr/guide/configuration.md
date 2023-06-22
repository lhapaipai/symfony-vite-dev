# Configuration

## Vite Plugin Symfony

Afin de conserver un maximum de flexibilité, j'ai décidé de ne pas créer de couche d'abstraction par dessus le fichier de configuration `vite.config.js`.

La seule option requise est `build.rollupOptions.input`. Avec `vite-plugin-symfony` cette option doit être définie en tant qu'objet.

```ts
export type InputOption = {
  // entryAlias sera utilisé par nos fonctions Twig
  [entryAlias: string]: string;
};
```

si vous avez un thème contenant uniquement des règles css (pas de js) il peut être intéressant de définir un point d'entrée avec un fichier \[s\]css. cela permettra notamment d'[empêcher le FOUC](/guide/tips#css-files-as-entrypoint) lors du développement.

```js
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
    plugins: [
        symfonyPlugin(),
    ],

    build: {
        rollupOptions: {
            input: {
                 /* relatif à l'option root */
                app: "./assets/app.ts",

                /* vous pouvez également fournir des fichiers [s]css */
                theme: "./assets/theme.scss"
            },
        }
    },
});
```

Afin de faciliter l'utilisation de Vite sans configuration, l'extension préconfigure certaines options de Vite si celles-ci n'ont pas encore été définies. (voir [code source](https://github.com/lhapaipai/vite-plugin-symfony/blob/main/src/index.ts))

::: code-group
```ts{4-15} [vite-plugin-symfony config()]
// vite-plugin-symfony/src/index.ts
config(userConfig) {

  const extraConfig: UserConfig = {
    base: userConfig.base ?? resolveBase(pluginOptions),
    publicDir: false,
    build: {
      manifest: true,
      outDir: userConfig.build?.outDir ?? resolveOutDir(pluginOptions),
    },
    optimizeDeps: {
      // Définir sur true pour anticiper le chargement des dépendances.
      force: true,
    },
  };

  return extraConfig;
}
```
```ts{5-13} [resolveBase()]
// vite-plugin-symfony/src/pluginOptions.ts
export function resolveBase(config: VitePluginSymfonyOptions): string {
  return "/" + config.buildDirectory + "/";
}
```
```ts{5-13} [resolveOutDir()]
// vite-plugin-symfony/src/pluginOptions.ts
export function resolveOutDir(config: VitePluginSymfonyOptions): string {
  return join(config.publicDirectory, config.buildDirectory);
}
```
:::

Pour toutes les options disponibles, vous pouvez consulter la page [Configuration : Vite plugin Symfony](/config/vite-plugin-symfony).


## Vite Bundle

Si vous modifiez certaines propriétés dans votre fichier `vite.config.js`, vous devrez probablement créer un fichier de configuration `pentatrion_vite.yaml` pour que votre bundle synchronise ces modifications. ça concerne:

- Options du plugins `vite-plugin-symfony`
  - `publicDirectory`
  - `buildDirectory`
- Options de base de `vite`
  - `base`
  - `build.outdir`


```yaml{3,4}
#config/packages/pentatrion_vite.yaml
pentatrion_vite:
  public_directory: public
  build_directory: build

  # etc...
```

Pour toutes les options disponibles, vous pouvez consulter la page [Configuration : Vite Bundle](/config/vite-bundle).
