import { useEffect, useRef } from 'react';

/**
 * Modal component that binds DOM events after mount using refs.
 */
function ShareModal() {
  const modalRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const openModal = () => {
      if (modalRef.current) {
        modalRef.current.classList.add('open');
      }
    };

    const btn = buttonRef.current;
    btn?.addEventListener('click', openModal);

    return () => {
      btn?.removeEventListener('click', openModal);
    };
  }, []);

  return (
    <>
      <button id="share-button" ref={buttonRef}>
        Share
      </button>
      <div id="share-modal" ref={modalRef} className="modal">
        {/* Modal content here */}
      </div>
    </>
  );
}

export default ShareModal;
