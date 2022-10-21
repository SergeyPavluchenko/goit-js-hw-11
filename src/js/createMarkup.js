export function createMarkup(photos) {
  return photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-link" href='${largeImageURL}'><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo" />
  <div class="info">
    <p class="info-item">
      <b class="info-item-text">Likes </b>${likes}
    </p>
    <p class="info-item">
      <b class="info-item-text">Views </b>${views}
    </p>
    <p class="info-item">
      <b class="info-item-text">Comments </b>${comments}
    </p>
    <p class="info-item">
      <b class="info-item-text">Downloads </b>${downloads}
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
}