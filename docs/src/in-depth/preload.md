# Preloading

The purpose of this page is to take stock of Vite's native behavior and the choices that have been made to copy its behavior into a Symfony application.
You may need to read this documentation if you are looking to fine-tune the preloading of scripts and stylesheets or if you want to contribute to the project. It will cover topics such as the `rel="preload"` and `rel="modulepreload"` attributes and `crossorigin="xxx"`.

## TL;DR;

source code used for the documentation of this page

```js
// assets/app.js
import { foo } from "./shared.js";
console.log(foo);

window.addEventListener("DOMContentLoaded", () => {
  import("./my-async-dep.ts").then(({ hello }) => {
    console.log(hello);
  });
});
```

Native Vite behavior: source code of the `index.html` file in dev mode

```html
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>
    <script type="module" src="/assets/app.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Desired behavior

In order to be exhaustive and because the Symfony application is served on another URL. the full URL of the Vite client will have to be written. We explicitly add the `crossorigin` attribute.

```html
<html lang="en">
  <head>
    <script type="module" src="http://127.0.0.1:5173/@vite/client" crossorigin></script>
    <script type="module" src="http://127.0.0.1:5173/assets/app.js" crossorigin></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Native Vite behavior: source code of the `index.html` file after a build

```html
<html lang="en">
  <head>
    <!-- the crossorigin attribute is present by default in all script and link tags -->
    <script type="module" crossorigin src="/assets/app-bXh9WZ8a.js"></script>
    <!--  scripts that have been split are preloaded -->
    <link rel="modulepreload" crossorigin href="/assets/shared-5Hh7diCN.js">
    <link rel="stylesheet" crossorigin href="/assets/index-Cz4zGhbH.css">
  </head>
  <body>
    ...
  </body>
</html>
```

Desired behavior with a preload in the form of html tags:

Exactly the same rendering as for the native behavior

Desired behavior with a preload with `Link` header:

although explicitly present in the source code of the html file, the file `/assets/app-bXh9WZ8a.js` will still be present in the `Link` header. If correctly configured, this does not cause an additional request but a request executed even earlier.


```bash
Link: </assets/app-bXh9WZ8a.js>; rel="modulepreload"; crossorigin, </assets/shared-5Hh7diCN.js>; rel="modulepreload"; crossorigin
```
```html
<!doctype html>
<html lang="en">
  <head>
    <!-- the crossorigin attribute is present by default in all script and link tags -->
    <script type="module" crossorigin src="/assets/app-bXh9WZ8a.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-Cz4zGhbH.css">
  </head>
  <body>
    ...
  </body>
</html>
```

Native behavior of Vite: source code of the `index.html` file after a build with the Legacy plugin

```html
<!doctype html>
<html class="page-welcome">
  <head>
    <meta charset="UTF-8" />
    <title>HelloController!</title>
    <link rel="icon" href="data:;base64,iBORw0KGgo=" />

    <link rel="modulepreload" crossorigin href="/assets/shared-5Hh7diCN.js">
    <link rel="stylesheet" crossorigin href="/build/assets/theme-gOv5yEUY.css" />
    <script type="module" crossorigin src="/build/assets/pageWelcome--4K79RzD.js"></script>

    <script type="module">/** DETECT_MODERN_BROWSER_INLINE_CODE */</script>
    <script type="module">/** DYNAMIC_FALLBACK_INLINE_CODE */</script>
  </head>

  <body>
    <script nomodule>/** SAFARI10_NO_MODULE_FIX_INLINE_CODE */</script>
    <script nomodule crossorigin src="/build/assets/polyfills-legacy-im0EAdDu.js" id="vite-legacy-polyfill" ></script>
    <script
      nomodule
      data-src="/build/assets/pageWelcome-legacy-TXGWt7m6.js"
      id="vite-legacy-entry-page-welcome"
      crossorigin
      class="vite-legacy-entry"
    >
      System.import(
        document.getElementById('vite-legacy-entry-page-welcome').getAttribute('data-src')
      );
    </script>
  </body>
</html>
```

## `crossorigin` attribute enabled by default in version 7 of `vite-bundle` .

Why?

- We are getting as close as possible to Vite's native behavior.
- Normally the [`cors`](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode) mode is implicitly enabled for any `<script type="module">` tag. Explicitly adding the `crossorigin` attribute should not change anything. But it allows polyfills like the one in [`modulePreload`](https://vitejs.dev/config/build-options.html#build-modulepreload) to work better. Indeed, without the presence of this attribute, the polyfill could perform an unnecessary fetch

```
A preload for 'https://example.org/build/example.js' is found, but is not used because the request credentials mode does not match. Consider taking a look at crossorigin attribute.
```


```ts
// from vite source code
// https://github.com/vitejs/vite/blob/1bda847329022d5279cfa2b51719dd19a161fd64/packages/vite/src/node/plugins/html.ts#L713
const toScriptTag = (
  chunk: OutputChunk,
  toOutputPath: (filename: string) => string,
  isAsync: boolean,
): HtmlTagDescriptor => ({
  tag: 'script',
  attrs: {
    ...(isAsync ? { async: true } : {}),
    type: 'module',
    // crossorigin must be set not only for serving assets in a different origin
    // but also to make it possible to preload the script using `<link rel="preload">`.
    // `<script type="module">` used to fetch the script with credential mode `omit`,
    // however `crossorigin` attribute cannot specify that value.
    // https://developer.chrome.com/blog/modulepreload/#ok-so-why-doesnt-link-relpreload-work-for-modules:~:text=For%20%3Cscript%3E,of%20other%20modules.
    // Now `<script type="module">` uses `same origin`: https://github.com/whatwg/html/pull/3656#:~:text=Module%20scripts%20are%20always%20fetched%20with%20credentials%20mode%20%22same%2Dorigin%22%20by%20default%20and%20can%20no%20longer%0Ause%20%22omit%22
    crossorigin: true,
    src: toOutputPath(chunk.fileName),
  },
})
```

the `build.modulePreload.polyfill` option injects this additional code that will explicitly create a fetch on the `<link rel="modulepreload" href="/script.js />` tags found in the source code.

- the polyfill only works for `modulepreload` not for `preload`
- thanks to the `MutationObserver` the polyfill will preload the `modulepreload` created throughout the lifecycle of the page.
- the polyfill is present in the js file of the entry point it is not injected in the `index.html` file,
no need to add it ourselves.

the source code is inspired by [es-module-shims](https://github.com/guybedford/es-module-shims/blob/13694283ec3b6aafdfd91ca1033df9f5f34bd4cf/src/es-module-shims.js#L603).

```ts
// source code from vite
// https://github.com/vitejs/vite/blob/1bda847329022d5279cfa2b51719dd19a161fd64/packages/vite/src/node/plugins/modulePreloadPolyfill.ts#L59
(function polyfill() {
  const relList = document.createElement('link').relList
  if (relList && relList.supports && relList.supports('modulepreload')) {
    return
  }

  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link)
  }

  new MutationObserver((mutations: any) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') {
        continue
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === 'LINK' && node.rel === 'modulepreload')
          processPreload(node)
      }
    }
  }).observe(document, { childList: true, subtree: true })

  function getFetchOpts(link: any) {
    const fetchOpts = {} as any
    if (link.integrity) fetchOpts.integrity = link.integrity
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy
    if (link.crossOrigin === 'use-credentials')
      fetchOpts.credentials = 'include'
    else if (link.crossOrigin === 'anonymous') fetchOpts.credentials = 'omit'
    else fetchOpts.credentials = 'same-origin'
    return fetchOpts
  }

  function processPreload(link: any) {
    if (link.ep)
      // ep marker = processed
      return
    link.ep = true
    // prepopulate the load record
    const fetchOpts = getFetchOpts(link)
    fetch(link.href, fetchOpts)
  }
})();
```

Something seems strange `if (link.crossOrigin === 'anonymous') fetchOpts.credentials = 'omit'`.
I've never seen this [crossorigin](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/crossOrigin). in my mind `anonymous` is associated with the value `same-origin` for `credentials`.

# Appendices

## Files generated during a build without the Legacy plugin


```json
// entrypoints.json
{
  "base": "/build/",
  "entryPoints": {
    "app": {
      "css": [
        "/build/assets/app-Cz4zGhbH.css"
      ],
      "dynamic": [
        "/build/assets/my-async-dep-BSHE5Y3H.js"
      ],
      "js": [
        "/build/assets/app-BBraN-Dm.js"
      ],
      "legacy": false,
      "preload": [
        "/build/assets/shared-5Hh7diCN.js"
      ]
    }
  },
  "legacy": false,
  "metadatas": {},
  "version": ["6.5.0", 6, 5, 0],
  "viteServer": null
}

// manifest.json
{
  "_shared-5Hh7diCN.js": {
    "file": "assets/shared-5Hh7diCN.js",
    "name": "shared"
  },
  "index.html": {
    "file": "assets/app-bXh9WZ8a.js",
    "name": "index",
    "src": "index.html",
    "isEntry": true,
    "imports": [
      /* files that need to be preloaded */
      "_shared-5Hh7diCN.js"
    ],
    "dynamicImports": [
      /* files that should not be preloaded */
      "src/my-async-dep.ts"
    ],
    "css": [
      "assets/index-Cz4zGhbH.css"
    ],
    /* assets are not preloaded */
    "assets": [
      "assets/typescript-EnIy2PE5.svg"
    ]
  },
  "src/my-async-dep.ts": {
    "file": "assets/my-async-dep-BSHE5Y3H.js",
    "name": "my-async-dep",
    "src": "src/my-async-dep.ts",
    "isDynamicEntry": true
  },
  "src/typescript.svg": {
    "file": "assets/typescript-EnIy2PE5.svg",
    "src": "src/typescript.svg"
  }
}
```



```js
// assets/app-bXh9WZ8a.js

// we find our files that need to be preloaded that are directly
// imported into the js code.
import { foo } from "./shared-5Hh7diCN.js";
console.log(foo);

// our dynamic imports are wrapped in a `preloadResources` function
// that does nothing special.
window.addEventListener("DOMContentLoaded", () => {
  preloadResources(async () => {
    const { hello } = await import("./my-async-dep-BSHE5Y3H.js");
    return { hello };
  }, []).then(({ hello }) => {
    console.log(hello);
  });
});

```


## Files generated with the Legacy plugin

```json
// entrypoints.json
{
  "base": "/build/",
  "entryPoints": {
    "pageWelcome-legacy": {
      "css": [],
      "dynamic": [],
      "js": [
        "/build/assets/pageWelcome-legacy-TXGWt7m6.js"
      ],
      "legacy": false,
      "preload": [
        "/build/assets/shared-legacy-Gun4aQJC.js"
      ]
    },
    "pageWelcome": {
      "css": [],
      "dynamic": [],
      "js": [
        "/build/assets/pageWelcome--4K79RzD.js"
      ],
      "legacy": "pageWelcome-legacy",
      "preload": [
        "/build/assets/shared-5Hh7diCN.js"
      ]
    },
    "theme-legacy": {
      "css": [],
      "dynamic": [],
      "js": [
        "/build/assets/theme-legacy-LruLDnf0.js"
      ],
      "legacy": false,
      "preload": []
    },
    "theme": {
      "css": [
        "/build/assets/theme-gOv5yEUY.css"
      ],
      "dynamic": [],
      "js": [],
      "legacy": "theme-legacy",
      "preload": []
    },
    "polyfills-legacy": {
      "css": [],
      "dynamic": [],
      "js": [
        "/build/assets/polyfills-legacy-im0EAdDu.js"
      ],
      "legacy": false,
      "preload": []
    }
  },
  "legacy": true,
  "metadatas": {},
  "version": ["6.5.0", 6, 5, 0],
  "viteServer": null
}
```
```json
// manifest.json
{
  "_shared-5Hh7diCN.js": {
    "file": "assets/shared-5Hh7diCN.js",
    "name": "shared"
  },
  "_shared-legacy-Gun4aQJC.js": {
    "file": "assets/shared-legacy-Gun4aQJC.js",
    "name": "shared"
  },
  "assets/page/welcome/index-legacy.js": {
    // legacy browsers only load this script
    "file": "assets/pageWelcome-legacy-TXGWt7m6.js",
    "isEntry": true,
    "src": "assets/page/welcome/index-legacy.js"
  },
  "assets/page/welcome/index.js": {
    // modern browsers only load this script
    "file": "assets/pageWelcome--4K79RzD.js",
    "isEntry": true,
    "src": "assets/page/welcome/index.js"
  },
  "assets/theme-legacy.scss": {
    "assets": [
      "assets/topography-iIXb0l18.svg"
    ],
    "file": "assets/theme-legacy-LruLDnf0.js",
    "isEntry": true,
    "src": "assets/theme-legacy.scss"
  },
  "assets/theme.scss": {
    "file": "assets/theme-gOv5yEUY.css",
    "isEntry": true,
    "src": "assets/theme.scss"
  },
  "vite/legacy-polyfills-legacy": {
    // polyfill loaded only once
    "file": "assets/polyfills-legacy-im0EAdDu.js",
    "isEntry": true,
    "src": "vite/legacy-polyfills-legacy"
  }
}
```

```html
<!doctype html>
<html class="page-welcome">
  <head>
    <meta charset="UTF-8" />
    <title>HelloController!</title>
    <link rel="icon" href="data:;base64,iBORw0KGgo=" />

    <!-- only the modern version of shared-XXX.js is preloaded -->
    <!-- the link and script tags of non-legacy files have the same attributes as the legacy plugin -->
    <!-- whether active or not -->
    <link rel="modulepreload" crossorigin href="/assets/shared-5Hh7diCN.js">
    <link rel="stylesheet" crossorigin href="/build/assets/theme-gOv5yEUY.css" />
    <script type="module" crossorigin src="/build/assets/pageWelcome--4K79RzD.js"></script>

    <script type="module">
      // DETECT_MODERN_BROWSER_INLINE_CODE
      // readable version with chatGPT
      try {
          // Check if the current environment supports the "import.meta" syntax
          const metaUrl = import.meta.url;
          // Attempt to import the "_" module and catch any errors
          import("_").catch(() => {});
      } catch (e) {
          // Do nothing if the "import" syntax or "import.meta" is not supported
      }

      // Set a global variable indicating that the browser is modern
      window.__vite_is_modern_browser = true;
    </script>
    <script type="module">
      // DYNAMIC_FALLBACK_INLINE_CODE
      // readable version with chatGPT
      (function() {
        if (window.__vite_is_modern_browser) {
            return;
        }

        console.warn("vite: loading legacy build because dynamic import or import.meta.url is unsupported, syntax error above should be ignored");

        var legacyPolyfill = document.getElementById("vite-legacy-polyfill");
        var script = document.createElement("script");
        script.src = legacyPolyfill.src;
        script.onload = function() {
            System.import(document.getElementById('vite-legacy-entry').getAttribute('data-src'))
        };
        document.body.appendChild(script);
      })();
    </script>
  </head>

  <body>
    <!-- ... -->
    <script nomodule>
      // SAFARI10_NO_MODULE_FIX_INLINE_CODE
      // readable version with chatGPT
      (function() {
          var document = window.document;
          var script = document.createElement("script");

          // Check if the "nomodule" attribute is supported and the "onbeforeload" event is supported
          if (!("noModule" in script) && "onbeforeload" in script) {
              var nomoduleFound = false;

              // Add a "beforeload" event listener
              document.addEventListener("beforeload", function(event) {
                  if (event.target === script) {
                      nomoduleFound = true;
                  } else if (!event.target.hasAttribute("nomodule") || !nomoduleFound) {
                      return;
                  }
                  event.preventDefault();
              }, true);

              script.type = "module";
              script.src = ".";
              document.head.appendChild(script);
              script.remove();
          }
      })();
    </script>
    <!-- script tags for the plugin -->
    <!-- 1/ do not have the type="module" attribute but the nomodule attribute instead-->
    <!-- 2/ have the crossorigin attribute like for the other tags -->
    <script
      nomodule
      crossorigin
      src="/build/assets/polyfills-legacy-im0EAdDu.js"
      id="vite-legacy-polyfill"
    ></script>
    <!-- for entry points that are css only, the associated **-XXX.js file should not be necessary. -->
    <script
      nomodule
      data-src="/build/assets/theme-legacy-LruLDnf0.js"
      id="vite-legacy-entry-theme"
      crossorigin
      class="vite-legacy-entry"
    >
      System.import(document.getElementById('vite-legacy-entry-theme').getAttribute('data-src'));
    </script>

    <script
      nomodule
      data-src="/build/assets/pageWelcome-legacy-TXGWt7m6.js"
      id="vite-legacy-entry-page-welcome"
      crossorigin
      class="vite-legacy-entry"
    >
      System.import(
        document.getElementById('vite-legacy-entry-page-welcome').getAttribute('data-src')
      );
    </script>
  </body>
</html>

```
