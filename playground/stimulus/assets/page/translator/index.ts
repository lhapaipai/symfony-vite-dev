
import {
  HELLO,
  FINISH_PLACE, INVITATION_TITLE, NUM_OF_APPLES, PROGRESS, PUBLISHED_AT, SAY_HELLO, VALUE_OF_OBJECT,
  trans,
} from './translator';

document.getElementById('hello')!.innerText = trans(HELLO);
document.getElementById('say_hello')!.innerText = trans(SAY_HELLO, {
  name: 'Fabien'
});
document.getElementById('invitation_title')!.innerText = trans(INVITATION_TITLE, {
  organizer_gender: 'female',
  organizer_name: 'Clara',
});
document.getElementById('num_of_apples')!.innerText = trans(NUM_OF_APPLES, {
  apples: 2
});
document.getElementById('finish_place')!.innerText = trans(FINISH_PLACE, {
  place: 1
});
document.getElementById('published_at')!.innerText = trans(PUBLISHED_AT, {
  publication_date: new Date('2023-04-27T08:12')
});
document.getElementById('progress')!.innerText = trans(PROGRESS, {
  progress: 0.58,
});
document.getElementById('value_of_object')!.innerText = trans(VALUE_OF_OBJECT, {
  value: 30
});
// No parameters, uses the default domain ("messages") and the default locale
// console.log(trans(TRANSLATION_SIMPLE));

// // Two parameters "count" and "foo", uses the default domain ("messages") and the default locale
// trans(TRANSLATION_WITH_PARAMETERS, { count: 123, foo: 'bar' });

// // No parameters, uses the default domain ("messages") and the default locale
// trans(TRANSLATION_MULTI_DOMAINS);
// // Same as above, but uses the "domain2" domain
// trans(TRANSLATION_MULTI_DOMAINS, {}, 'domain2');
// // Same as above, but uses the "domain3" domain
// trans(TRANSLATION_MULTI_DOMAINS, {}, 'domain3');

// // No parameters, uses the default domain ("messages") and the default locale
// trans(TRANSLATION_MULTI_LOCALES);
// // Same as above, but uses the "fr" locale
// trans(TRANSLATION_MULTI_LOCALES, {}, 'messages', 'fr');
// // Same as above, but uses the "it" locale
// trans(TRANSLATION_MULTI_LOCALES, {}, 'messages', 'it');