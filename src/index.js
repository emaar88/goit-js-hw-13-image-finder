import './styles.css';
import requestPhotos from './apiService.js';
import debounce from 'lodash.debounce';
import pixabayPhotos from './templates/pixabay-photos.hbs';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';

const searchForm = document.querySelector('#search-form');
const galleryList = document.querySelector('#gallery-list');
const loadMore = document.querySelector('#load-more');

searchForm.addEventListener('input', debounce(searchFormInputHandler, 1800));
loadMore.addEventListener('click', loadMoreBtnHandler);
searchForm.addEventListener('keydown', pressEnter);

function searchFormInputHandler(e) {
  e.preventDefault();
  const inputKeyword = document.querySelector('#our_keyword');
  clearListItems();
  requestPhotos.resetPage();
  if (inputKeyword.value === '') {
    loadMore.classList.add('is-hidden');
    return;
  }

  loadMore.classList.remove('is-hidden');
  requestPhotos.searchQuery = inputKeyword.value;
  fetchPhotosForKeyword();
}

function pressEnter(e) {
  const inputKeyword = document.querySelector('#our_keyword');
  if (e.keyCode == 13) {
    e.preventDefault();
    clearListItems();
    requestPhotos.resetPage();
    loadMore.classList.remove('is-hidden');
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
  }, 800);
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
  galleryList.insertAdjacentHTML('beforeend', markup);
  if (markup === '') {
    loadMore.classList.add('is-hidden');
    PNotify.info({
      text: 'Совпадений не найдено. Введите правильный запрос',
      delay: 3000,
      icon: true,
    });
  }
}

function clearListItems() {
  galleryList.innerHTML = '';
}
