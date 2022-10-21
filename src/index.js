import { PixabayApi } from './js/fetch';
import { refs } from './js/refs';
import { createMarkup } from './js/createMarkup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabay = new PixabayApi();

const options = {
  root: null,
  rootMargin: '150px',
  threshold: 1.0,
};
const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting && entry.intersectionRect.bottom > 550) {
      console.log(entry.isIntersecting);
      pixabay.incrementPage();
      observer.unobserve(entry.target);

      // if (!pixabay.isShowLoadMore) {
      //   observer.unobserve(entry.target);
      // }
      try {
        const { hits } = await pixabay.getPhotos();
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        if (pixabay.isShowLoadMore) {
          console.log(pixabay.isShowLoadMore);
          const target = document.querySelector('.photo-link:last-child');
          observer.observe(target);
        }

        lightbox.refresh();
        scrollPage();
      } catch (error) {
        Notify.failure(error.message);
        clearPage();
      }
    }
  });
};

const observer = new IntersectionObserver(callback, options);

async function searchPhotos(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

  if (!searchQuery) {
    Notify.failure('Enter data to search, please!');
    return;
  }
  pixabay.query = searchQuery;
  clearPage();

  try {
    const { hits, total, totalHits } = await pixabay.getPhotos();
    if (hits.length === 0) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    const target = document.querySelector('.photo-link:last-child');
    console.log(target);
    observer.observe(target);

    pixabay.calculateTotalPages(totalHits);

    Notify.success(`Hooray! We found ${total} images.`);
    lightbox.refresh();

    if (pixabay.isShowLoadMore) {
      // refs.loadMoreBtn.classList.remove('is-hidden');
      const target = document.querySelector('.photo-link:last-child');
      observer.observe(target);
    }
    scrollPage();
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }
}
const onLoadMore = async () => {
  pixabay.incrementPage();
  if (data.hits.length < 40) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  try {
    const { hits } = await pixabay.getPhotos();
    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    scrollPage();
  } catch (error) {
    Notify.failure(error.message);
    clearPage();
  }
};

refs.form.addEventListener('submit', searchPhotos);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function clearPage() {
  pixabay.resetPage();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('.is-hidden');
}
const lightbox = new SimpleLightbox('.gallery a');

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}