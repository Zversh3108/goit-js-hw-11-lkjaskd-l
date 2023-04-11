import axios from 'axios';
export default class GalleryApiServise {
  constructor(config) {
    this.searchData = '';
    this.page = 1;
    this.options = new URLSearchParams({
      key: '34966531-d731aa6138bbacb35975da1df',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });
    this.loadMoreBtn = config.loadMoreBtn;
    this.getPerPage = Number(this.options.get('per_page'));
  }

  async getPhotos() {
    this.options.set('page', this.page.toString());
    this.options.set('q', this.searchData);

    const response = await axios.get(
      `https://pixabay.com/api/?${this.options.toString()}`
    );

    const newPage = await this.newPage();
    const { hits, totalHits, total } = response.data;
    if (totalHits <= this.options.get('per_page')) {
      this.loadMoreBtn.style.visibility = 'hidden';
    }
    return { hits, totalHits, total };
  }
  newPage() {
    this.page += 1;
    return this.page;
  }
  get data() {
    return this.searchData;
  }
  set data(newData) {
    this.searchData = newData;
  }

  showEndMessage(total) {
    return this.page * this.options.get('per_page') < total;
  }

}
// asxas;lxkaslkx