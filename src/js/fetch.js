import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';

// 30720436-88ffd0ded62e0d7b7cde7caf4

export class PixabayApi {
  #page = 1;
  #query = '';
  #allTotalPages = 0;
  #perPage = 40;
  #params = {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  };

  async getPhotos() {
    const url = `/?key=30720436-88ffd0ded62e0d7b7cde7caf4&q=${
      this.#query
    }&page=${this.#page}`;
    const { data } = await axios.get(url, this.#params);
    return data;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  get query() {
    return this.#query;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  calculateTotalPages(total) {
    this.#allTotalPages = Math.ceil(total / this.#perPage);
  }

  get isShowLoadMore() {
    return this.#page < this.#allTotalPages;
  }
}