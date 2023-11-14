# Stimulus : Lazy controllers

Si vous souhaitez définir vos propres contrôleurs avec un chargement paresseux, voici quelques différences dont vous devez avoir connaissance.

Implémentation de Stimulus bundle avec Webpack Encore

```js
// assets/controllers/welcome_controller.js
import { Controller } from '@hotwired/stimulus';

// N'EST PAS COMPATIBLE !
/* stimulusFetch: 'lazy' */ // [!code --]
export default class extends Controller {
    // ...
}
```

Implémentation du bundle Stimulus avec Vite. Par défaut tous vos contrôleurs sont chargés à la demande. Si vous ne souhaitez pas cela vous pouvez définir le mode `eager`.

```js
// assets/bootstrap.js
const app = startStimulusApp();

registerControllers(
  app,
  import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?', eager: true) // [!code ++]
)
```


Si vous voulez définir parmi ceux-ci quelques controlleurs avec un chargement différé, suffixez plutôt le nom de votre controleur avec `_lazycontroller.js` :



```js
// assets/controllers/welcome_lazycontroller.js // [!code ++]
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    // ...
}
```

Ou vous pouvez appeler « registerControllers » plusieurs fois.

### Contrôleurs tiers

Le loader webpack de `@symfony/stimulus-bridge` ne peut être utilisé.

```js
// N'EST PAS COMPATIBLE !
import Clipboard from '@symfony/stimulus-bridge/lazy-controller-loader?lazy=true!stimulus-clipboard'; // [!code --]
const app = startStimulusApp(require.context(
    // ...
));

app.register('clipboard', Clipboard);
```

Chargez plutôt ces contrôleurs avec le fichier `controllers.json`

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
