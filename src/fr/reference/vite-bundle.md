# Vite bundle Options

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

## throw_on_missing_entry

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Par défaut, vite-bundle ignorera silencieusement vos appels à des points d'entrée qui ne sont pas présents dans votre `entrypoints.json`. En définissant cette option à `true`, Symfony lèvera une exception dans de tels cas.

## script_attributes

- **Type :** `associative array`
- **Valeur par défaut :** `[]`

Précisez ici vos attributs que vous souhaiterez faire apparaître sur toutes vos balises HTML `<script>`.

```yaml
pentatrion_vite:
  script_attributes:
    defer: true
    referrerpolicy: origin
```

## link_attributes

- **Type :** `associative array`
- **Valeur par défaut :** `[]`

Précisez ici vos attributs que vous souhaiterez faire apparaître sur toutes vos balises HTML `<style>`.

```yaml
pentatrion_vite:
  link_attributes:
    referrerpolicy: origin
```

## default_config

- **Type :** `null | string`
- **Valeur par défaut :** `null`

Si vous avez défini plusieurs configurations de vite.

::: warning
Dans le cas d'une configuration multiple, il faudra laisser les options `build_directory`, `script_attributes` et `link_attributes` vides et les définir dans l'option `builds` qui va suivre.
:::

## builds

- **Type :** `associative array of build config`
- **Valeur par défaut :** `[]`

```yaml
pentatrion_vite:
  default_config: <custom-build-name-1>
  builds:
    <custom-build-name-1>:

      build_directory: config1

      script_attributes:
        # etc

      link_attributes:
        # etc
```
