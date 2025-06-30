document.addEventListener('DOMContentLoaded', () => {
  const shareBtn = document.getElementById('share-button');
  if (!shareBtn) return;
  shareBtn.addEventListener('click', () => {
    const modal = document.getElementById('share-modal');
    if (modal) {
      modal.classList.add('open');
    }
  });
});
