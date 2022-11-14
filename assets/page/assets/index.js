import './index.scss';
import violin from '../../images/violin.jpg';


window.addEventListener('DOMContentLoaded', () => {
  let img = document.createElement('img')
  img.src = violin;
  document.getElementById('vite-asset-js-container').append(img)
});

