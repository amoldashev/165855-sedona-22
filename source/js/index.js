const button = document.querySelector('#menu-button');
const cancel = document.querySelector('#menu-cancel');
const menu = document.querySelector('.menu');
const nav = document.querySelector('.main-header__main-nav');

nav.classList.remove('main-header__main-nav--nojs');

let isOpen = true;

const buttonHandler = () => {
  if(isOpen == false) {
    menu.classList.toggle('hide');
    isOpen = !isOpen;
  };
}

button.addEventListener('click', buttonHandler);

const menuHandler = () => {
  if (isOpen == true) {
    menu.classList.toggle('hide');
    isOpen = !isOpen;
  }
}

cancel.addEventListener('click', menuHandler);
