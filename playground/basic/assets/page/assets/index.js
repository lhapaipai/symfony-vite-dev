import './index.scss';
import violin1 from '../../images/violin.jpg';
import violin2 from '../../images/deep/violin.jpg';


window.addEventListener('DOMContentLoaded', () => {
  let img1 = document.createElement('img')
  img1.src = violin1;
  document.getElementById('vite-asset-js-container-1').append(img1)

  let img2 = document.createElement('img')
  img2.src = violin2;
  document.getElementById('vite-asset-js-container-2').append(img2)

});

