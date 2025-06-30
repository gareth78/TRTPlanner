import { useEffect } from 'react';

function useOutsideClick(
  isActive: boolean,
  ref: React.RefObject<HTMLElement>,
  exclude: React.RefObject<HTMLElement> | null,
  handler: () => void,
) {
  useEffect(() => {
    function handle(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (
        isActive &&
        ref.current &&
        !ref.current.contains(target) &&
        (!exclude || !exclude.current || !exclude.current.contains(target))
      ) {
        handler();
      }
    }
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
  }, [isActive, ref, exclude, handler]);
}

export default useOutsideClick;
