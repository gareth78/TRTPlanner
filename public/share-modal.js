function attachShareModalListener() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.id === 'share-button') {
      const modal = document.getElementById('share-modal');
      if (modal) {
        modal.classList.add('open');
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachShareModalListener);
} else {
  attachShareModalListener();
}
