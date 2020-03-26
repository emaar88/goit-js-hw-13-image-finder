import './styles.css';
import requestPhotos from './apiService.js';
import debounce from 'lodash.debounce';
import pixabayPhotos from './templates/pixabay-photos.hbs';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';

const searchForm = document.querySelector('#search-form');
const galleryList = document.querySelector('#gallery-list');
const loadMore = document.querySelector('#load-more');
const findPhotos = document.querySelector('#findPhotosBtn');

findPhotos.addEventListener('click', searchFormInputHandler);
loadMore.addEventListener('click', loadMoreBtnHandler);
searchForm.addEventListener('keydown', pressEnter);

function searchFormInputHandler(e) {
  console.log('Ura');
  e.preventDefault();
  const inputKeyword = document.querySelector('#our_keyword');
  clearListItems();
  requestPhotos.resetPage();
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

function pressEnter(e) {
  const inputKeyword = document.querySelector('#our_keyword');
  if (e.keyCode == 13) {
    e.preventDefault();
    clearListItems();
    requestPhotos.resetPage();
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
  }, 500);
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
