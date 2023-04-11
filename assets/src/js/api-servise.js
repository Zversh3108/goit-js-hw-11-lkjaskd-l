export default class GalleryApiServise {
  constructor() {
    this.searchData = '';
    this.page = 1;
    this.options = new URLSearchParams({
      key: '34966531-d731aa6138bbacb35975da1df',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
  }

  async fetchPhotos(name) {
    this.options.set('q', this.searchData);
    this.options.set('page', this.page.toString());
    const response = await fetch(
      `https://pixabay.com/api/?${this.options.toString()}`
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    const photos = await response.json();
    const newPage = await this.newPage();
    return photos;
  }

  get data() {
    return this.searchData;
  }
  set data(newData) {
    this.searchData = newData;
  }
  async newPage() {
    this.page += 1;
  }
  async resetPage() {
    this.page = 1;
  }
}
