import { useEffect } from 'react';

/**
 * Modal component that binds DOM events after mount.
 */
function ShareModal() {
  useEffect(() => {
    const modalTrigger = document.getElementById('share-button');
    const modal = document.getElementById('share-modal');

    function openModal() {
      if (modal) {
        modal.classList.add('open');
      }
    }

    modalTrigger?.addEventListener('click', openModal);

    return () => {
      modalTrigger?.removeEventListener('click', openModal);
    };
  }, []);

  return null;
}

export default ShareModal;
