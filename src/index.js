import Notiflix from 'notiflix';
import GalleryApiServise from './js/api-servise';

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('[name = "searchQuery"]'),
  photosContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const galleryApiServise = new GalleryApiServise({
  loadMoreBtn: refs.loadMoreBtn,
});
let photosMarkup = '';

async function onSearch(evt) {
  evt.preventDefault();
  if (refs.input.value.trim() === '') {
    Notiflix.Notify.failure('Enter a keyword to search');
    return;
  }
  galleryApiServise.data = refs.input.value.trim();

  try {
    const resetPage = await galleryApiServise.resetPage();
    const { hits, totalHits } = await galleryApiServise.getPhotos();
    const validationResult = await validation(totalHits);
    if (validationResult) {
      photosMarkup = randingImages(hits);
      refs.photosContainer.innerHTML = photosMarkup;
    }
  } catch (error) {}
}
function validation(totalHits) {
  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.photosContainer.innerHTML = '';
    refs.loadMoreBtn.style.visibility = 'hidden';
    return false;
  }
  if (totalHits <= galleryApiServise.getPerPage) {
    refs.loadMoreBtn.style.visibility = 'hidden';
  } else {
    refs.loadMoreBtn.style.visibility = 'visible';
  }
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  return true;
}

const randingImages = hits => {
  return hits
    .map(
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
    )
    .join('');
};
async function onLoadMore() {
  try {
    const { hits, totalHits } = await galleryApiServise.getPhotos();
    const photosMarkup = randingImages(hits);
    refs.photosContainer.insertAdjacentHTML('beforeend', photosMarkup);
    if (!galleryApiServise.showEndMessage(totalHits)) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.style.visibility = 'hidden';
    }
  } catch (error) {}
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
