import './app.scss';
import identite from './identite.jpg';


import { sentence } from "./other";


console.log(sentence)

setTimeout(() => {
  
  let img = document.createElement('img')
  img.src = identite;
  
  document.body.append(img)
}, 5000);