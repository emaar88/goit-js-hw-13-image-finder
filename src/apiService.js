const basedURL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal`;
const myKey = `15388993-afe6d4c7cebda1ca737d5f782`;

export default {
  page: 1,
  query: '',
  fetchPhotos(query) {
    const requestParams = `&q=${this.query}&page=${this.page}&per_page=12&key=`;
    return fetch(basedURL + requestParams + myKey)
      .then(response => response.json())
      .then(parsedResponce => {
        this.incrementPage();
        return parsedResponce.hits;
      });
  },
  get searchQuery() {
    return this.query;
  },
  set searchQuery(string) {
    this.query = string;
  },
  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};

//https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ
