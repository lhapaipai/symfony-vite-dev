# Stimulus : Lazy controllers

If you want to define your own controllers with lazy loading, there is differences with the original implementation.

Stimulus bundle with Webpack Encore implementation

```js
// assets/controllers/welcome_controller.js
import { Controller } from '@hotwired/stimulus';

// IS NOT COMPATIBLE !
/* stimulusFetch: 'lazy' */ // [!code --]
export default class extends Controller {
    // ...
}
```

Stimulus bundle with Vite implementation. By default all your controllers are lazy loaded. If you don't want, just define eager mode :

```js
// assets/bootstrap.js
const app = startStimulusApp();

registerControllers(
  app,
  import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?', {eager: true}) // [!code ++]
)
```

If you still want to define some lazy controllers, Suffix them with `_lazycontroller.js`:

```js
// assets/controllers/welcome_lazycontroller.js // [!code ++]
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    // ...
}
```

Or you can call `registerControllers` multiple times.

### Third-party controllers

The webpack loader from `@symfony/stimulus-bridge` cannot be used.

```js
// IS NOT COMPATIBLE !
import Clipboard from '@symfony/stimulus-bridge/lazy-controller-loader?lazy=true!stimulus-clipboard'; // [!code --]
const app = startStimulusApp(require.context(
    // ...
));

app.register('clipboard', Clipboard);
```

Instead, load these controllers with the `controllers.json` file .

```json
{
    "controllers": {
        "stimulus-clipboard": {     // npm package name
            "default": { // controller id

                // to prevent collisions symfony generate a
                // controller name : <package-name>--<controller-name>
                // define here your custom name if you want to use simpler name
                "name": "stimulus-clipboard",
                "enabled": true,
                "fetch": "lazy" // [!code ++]
            }
        }
    },
    "entrypoints": []
}
```
