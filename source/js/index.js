const button = document.querySelector('#menu-button');
const cancel = document.querySelector('#menu-cancel');
const menu = document.querySelector('.menu');
const nav = document.querySelector('.main-header__main-nav');
const BROWSER_WIDTH = 1151;

nav.classList.remove('main-header__main-nav--nojs');

let isOpen = true;

const buttonHandler = () => {
  if(isOpen == false) {
    menu.classList.toggle('hide');
    isOpen = !isOpen;
  };
}



const menuHandler = () => {
  if (isOpen == true) {
    menu.classList.toggle('hide');
    isOpen = !isOpen;
  }
}

cancel.addEventListener('click', menuHandler);
button.addEventListener('click', buttonHandler);

function resizeHandler() {
  if (window.innerWidth > BROWSER_WIDTH) {
    menu.classList.remove('hide');
    cancel.removeEventListener('click', menuHandler);
    button.removeEventListener('click', buttonHandler);
  } else {
    console.log(window.innerWidth)
    button.addEventListener('click', buttonHandler);
    cancel.addEventListener('click', menuHandler);
  }
}

window.addEventListener('resize', resizeHandler);
