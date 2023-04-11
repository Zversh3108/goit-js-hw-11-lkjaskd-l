import Notiflix from 'notiflix';
import GalleryApiServise from './js/api-servise';
const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('[name = "searchQuery"]'),
  photosContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more-btn'),
};

const galleryApiServise = new GalleryApiServise();
let photosMarkup = '';

async function onSearch(evt) {
  evt.preventDefault();

  galleryApiServise.data = refs.input.value;
  try {
    const resetPage = await galleryApiServise.resetPage();
    const photos = await galleryApiServise.fetchPhotos();
    const randing = await randingImages(photos);
    const newButton = await removeClass();
  } catch (error) {
    console.log();
  }
}

 function randingImages(images) {
  photosMarkup = images => {
    return images.hits.flatMap(
      photo =>
        `<div class="photo-card">
      <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${photo.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${photo.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${photo.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${photo.downloads}
        </p>
      </div>
    </div>`
    );
  };
  refs.photosContainer.insertAdjacentHTML('beforeend', photosMarkup(images));
}
async function onLoadMore() {
  try {
    const photos = await galleryApiServise.fetchPhotos();
    const randerPhotos = await randingImages(photos);
  } catch (error) {
    console.log(error);
  }
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function removeClass() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
