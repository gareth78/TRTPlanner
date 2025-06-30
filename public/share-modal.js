const el = document.getElementById('share-button');
if (el) {
  el.addEventListener('click', () => {
    const modal = document.getElementById('share-modal');
    if (modal) {
      modal.classList.add('open');
    }
  });
}
