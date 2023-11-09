import { trans, getLocale, setLocale, setLocaleFallbacks } from '@symfony/ux-translator';
import { localeFallbacks } from '~project/var/translations/configuration';

setLocaleFallbacks(localeFallbacks);

setLocale("fr")

export { trans }
export * from '~project/var/translations';