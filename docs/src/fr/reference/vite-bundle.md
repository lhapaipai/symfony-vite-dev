# Vite bundle options <img src="/images/logo-packagist.svg" width="28" height="32" style="display: inline; vertical-align: -10%; " />

La configuration du bundle se fait dans le fichier `config/packages/pentatrion_vite.yaml`.

```yaml
pentatrion_vite:
  public_directory: public
  build_directory: build
  throw_on_missing_entry: true
  # etc...
```

## public_directory

- **Type :** `string`
- **Valeur par défaut :** `public`

Chemin relatif depuis le dossier racine de votre projet vers le dossier public de votre serveur web. Dans certains cas il peut s'agir de `www` ou `public_html`.

## build_directory

- **Type :** `string`
- **Valeur par défaut :** `build`

Chemin relatif depuis votre dossier public dans lequel ont été compilés vos fichiers à la suite d'un `vite build`.

## proxy_origin

- **Type :** `null | string`
- **Valeur par défaut :** `null`

Lors d'une utilisation avec Docker, vous pouvez désirer spécifier une origine différente si vous démarrer votre serveur de développement Vite en dehors de votre conteneur Docker. (ex: `http://host.docker.internal:5173`).

## absolute_url

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Génère des URL complètes de vos fichiers js/css/assets générés (schema + domaine + chemin).

## throw_on_missing_asset

- **Type :** `boolean`
- **Valeur par défaut :** `true`

Par défaut, vite-bundle lèvera une exception si vous utilisez la function Twig `asset()` avec un chemin qui n'est pas présent dans le fichier `manifest.json`, dans certains cas des plugins peuvent copier des fichiers statiques sans qu'ils ne soient référencés dans le manifeste, vous devrez donc assigner la valeur à `false` pour pouvoir y faire référence.

```js
import { defineConfig } from 'vite'

import symfonyPlugin from 'vite-plugin-symfony';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "assets/images/angular.svg",
          dest: "static"
        }
      ]
    }),
    symfonyPlugin(),
  ],
  // ...
});
```
```yaml
# config/packages/framework.yaml
framework:
    assets:
        version_strategy: 'Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy'
```
```twig
<img src="{{ asset('static/angular.svg')}}" />
```

## throw_on_missing_entry

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Par défaut, vite-bundle ignorera silencieusement vos appels à des points d'entrée qui ne sont pas présents dans votre `entrypoints.json`. En définissant cette option à `true`, Symfony lèvera une exception dans de tels cas.

## cache

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Active le mise en cache des fichiers `entrypoinst.json` et `manifest.json`. Ne doit être activé qu'en production.

```yaml
# config/packages/pentatrion_vite.yaml
when@prod:
    pentatrion_vite:
        cache: true
```

La création d'un cache optimal se fait dans l'étape de warm-up (sinon un cache php sera créé par fichier).

```bash
npm run build

# vide le cache et effectue un warm-up
# important cette étape doit avoir lieu après le `npm run build`
symfony console cache:clear
```

Pour plus d'informations voir la section [performances](/fr/guide/performances#mise-en-cache-des-fichiers-de-configuration).

## preload

- **Type :** `"none"` | `"link-tag"` | `"link-header"`
- **Valeur par défaut :** `link-tag`

Définit la stratégie de préchargement de vos fichiers.

Avec `"link-tag"`, vos dépendances JS seront préchargées en utilisant une balise `<link rel="modulepreload">`.

Avec `"link-header"`, préchargez automatiquement tous les scripts rendus et les balises de lien via l'en-tête http2 Link. Nécessite le composant Symfony [symfony/web-link](https://github.com/symfony/web-link).

Pour plus de détail, voir la section [performances](/fr/guide/performances#prechargement-de-vos-scripts).


## crossorigin

- **Type :** `false` | `"anonymous"` | `"use-credentials"`
- **Valeur par défaut :** `false`

Si vous précisez cette option, un attribut `crossorigin` sera ajouté à toutes les balises : `<script>`, `<link rel="stylesheet">`, `<link rel="modulepreload">` et les balises internes de Vite.

Si vous avez spécifié une configuration multiple avec `configs`, cette option sera appliquée à **toutes** vos configurations.


## script_attributes

- **Type :** `associative array`
- **Valeur par défaut :** `[]`

Précisez ici vos attributs que vous souhaiterez faire apparaître sur toutes vos balises HTML `<script>`. Remarque: les balises `<script>` spécifiques à Vite JS comme `<script type="module" src="http://127.0.0.1:5176/build/@vite/client"></script>` ne seront pas affectées.

```yaml
pentatrion_vite:
  script_attributes:
    defer: true
    referrerpolicy: origin
```
S'il vous souhaitez tout de même intervenir sur les attributs des balises internes à Vite vous pouvez écouter l'événement : `Pentatrion\ViteBundle\Event\RenderAssetTagEvent`, voir [attributs personnalisés](/fr/guide/custom-attributes).


## link_attributes

- **Type :** `associative array`
- **Valeur par défaut :** `[]`

Précisez ici les attributs que vous souhaitez faire apparaître sur toutes vos balises HTML `<link rel="stylesheet">` (Attention vos balises `<link rel="modulepreload">` ne seront pas affectées).

```yaml
pentatrion_vite:
  link_attributes:
    referrerpolicy: origin
```


## preload_attributes

- **Type :** `associative array`
- **Valeur par défaut :** `[]`

Précisez ici les attributs que vous souhaitez faire apparaître sur toutes vos balises HTML `<link rel="modulepreload">`.

```yaml
pentatrion_vite:
  preload_attributes:
    referrerpolicy: origin
```



## default_config

- **Type :** `null | string`
- **Valeur par défaut :** `null`

Si vous avez défini plusieurs configurations de vite.

::: warning
Dans le cas d'une configuration multiple, il faudra laisser les options `build_directory`, `script_attributes`, `link_attributes` et `preload_attributes` vides et les définir dans l'option `configs` qui va suivre.
:::

## configs

- **Type :** `tableau associatif de configs`
- **Valeur par défaut :** `[]`

```yaml
pentatrion_vite:
  default_config: <custom-config-name-1>
  configs:
    <custom-config-name-1>:

      build_directory: build-1

      script_attributes:
        # etc

      link_attributes:
        # etc

      preload_attributes:
        # etc

```



## <del>default_build</del>

- **Type :** `null | string`
- **Valeur par défaut :** `null`
- **Déprécié** (sera retiré dans les versions 6.x)

::: warning
Cette option est dépréciée, utilisez `default_config` à la place.
:::

Si vous avez défini plusieurs configurations de vite.

::: warning
Dans le cas d'une configuration multiple, il faudra laisser les options `build_directory`, `script_attributes` et `link_attributes` vides et les définir dans l'option `builds` qui va suivre.
:::


## <del>builds</del>

- **Type :** `tableau associatif de configs`
- **Valeur par défaut :** `[]`
- **Déprécié** (sera retiré dans les versions 6.x)

::: warning
Cette option est dépréciée, utilisez `configs` à la place.
:::

```yaml
pentatrion_vite:
  default_build: <custom-build-name-1>
  builds:
    <custom-build-name-1>:

      build_directory: build1

      script_attributes:
        # etc

      link_attributes:
        # etc
```
