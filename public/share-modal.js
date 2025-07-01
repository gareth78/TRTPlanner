function attachShareModalListener() {
  const button = document.getElementById('share-button');
  const modal = document.getElementById('share-modal');
  if (button && modal) {
    button.addEventListener('click', () => {
      modal.classList.add('open');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachShareModalListener);
} else {
  attachShareModalListener();
}

