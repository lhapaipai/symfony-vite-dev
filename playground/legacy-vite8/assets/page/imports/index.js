import { msg } from "~/lib/other";

let $syncMsg = document.createElement('p');
$syncMsg.innerText = msg;

document.getElementById('log').append($syncMsg)

setTimeout(() => {
  import('~/lib/async-dep').then(({msg}) => {
    let $asyncMsg = document.createElement('p');
    $asyncMsg.innerText = msg;
    
    document.getElementById('log').append($asyncMsg)
  })
}, 1000)