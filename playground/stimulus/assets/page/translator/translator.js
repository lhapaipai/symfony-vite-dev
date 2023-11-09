import { trans, getLocale, setLocale, setLocaleFallbacks } from '@symfony/ux-translator';
import { localeFallbacks } from '~project/var/translations/configuration';
/*
 * This file is part of the Symfony UX Translator package.
 *
 * If folder "../var/translations" does not exist, or some translations are missing,
 * you must warmup your Symfony cache to refresh JavaScript translations.
 *
 * If you use TypeScript, you can rename this file to "translator.ts" to take advantage of types checking.
 */

setLocaleFallbacks(localeFallbacks);

setLocale("fr")

export { trans }
export * from '~project/var/translations';