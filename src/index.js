import './styles.css';
import requestPhotos from './apiService.js';
import debounce from 'lodash.debounce';
import pixabayPhotos from './templates/pixabay-photos.hbs';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';

const searchForm = document.querySelector('#search-form');
const galleryList = document.querySelector('#gallery-list');
const loadMore = document.querySelector('#load-more');
const findPhotos = document.querySelector('#findPhotosBtn');
const to_up = document.querySelector('#to_up');

findPhotos.addEventListener('click', searchFormInputHandler);
loadMore.addEventListener('click', loadMoreBtnHandler);
searchForm.addEventListener('keydown', pressEnter);
to_up.addEventListener('click', toScrollToMyHeader);

function searchFormInputHandler(e) {
  e.preventDefault();
  clearListItems();
  requestPhotos.resetPage();
  toLoadPhotos();
}

function pressEnter(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    clearListItems();
    requestPhotos.resetPage();
    toLoadPhotos();
  }
}

function toLoadPhotos() {
  const inputKeyword = document.querySelector('#our_keyword');
  if (inputKeyword.value === '') {
    loadMore.classList.add('is-hidden');
    PNotify.info({
      text: 'Вы не ввели ключевое слово',
      delay: 3000,
      icon: true,
    });
    return;
  }
  if (inputKeyword.value !== '') {
    requestPhotos.searchQuery = inputKeyword.value;
    fetchPhotosForKeyword();
  }
}

function loadMoreBtnHandler() {
  fetchPhotosForKeyword();
  setTimeout(() => {
    window.scrollTo({
      top: +window.scrollY + 1162,
      behavior: 'smooth',
    });
    to_up.classList.remove('to_close');
  }, 1000);
}

function fetchPhotosForKeyword() {
  requestPhotos
    .fetchPhotos()
    .then(photos => {
      insertListPhotos(photos);
    })
    .catch(err => console.warn(err));
}

function insertListPhotos(items) {
  const markup = pixabayPhotos(items);
  if (markup === '') {
    loadMore.classList.add('is-hidden');
    PNotify.info({
      text: 'Совпадений не найдено. Попробуйте ввести другое ключевое слово',
      delay: 3000,
      icon: true,
    });
    return;
  }
  galleryList.insertAdjacentHTML('beforeend', markup);
  loadMore.classList.remove('is-hidden');
}

function clearListItems() {
  galleryList.innerHTML = '';
}

function toScrollToMyHeader() {
  console.log('Pivet');
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    to_up.classList.add('to_close');
  }, 100);
}
