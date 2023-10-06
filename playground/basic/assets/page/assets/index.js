import './index.scss';
import logoVite from '~/images/logo-vite.svg';
import logoSymfony from '../../images/logo-symfony.svg';
import logoPentatrion from '/assets/images/logo-pentatrion.svg';

import '~/images/logo-symfony-less-4kb.png'

window.addEventListener('DOMContentLoaded', () => {
  let img1 = document.createElement('img')
  img1.src = new URL(logoVite, import.meta.url).href;
  document.getElementById('vite-asset-js-img-1').append(img1)
  document.getElementById('vite-asset-js-url-1').innerText = logoVite;

  let img2 = document.createElement('img')
  img2.src = logoSymfony;
  document.getElementById('vite-asset-js-img-2').append(img2)
  document.getElementById('vite-asset-js-url-2').innerText = logoSymfony;

  let img3 = document.createElement('img')
  img3.src = logoPentatrion;
  document.getElementById('vite-asset-js-img-3').append(img3)
  document.getElementById('vite-asset-js-url-3').innerText = logoPentatrion;


  for (let i = 1; i <= 4; i++) {
    document.getElementById(`vite-asset-scss-url-${i}`).innerText = getComputedStyle(document.getElementById(`vite-asset-scss-img-${i}`)).backgroundImage;
  }
});

