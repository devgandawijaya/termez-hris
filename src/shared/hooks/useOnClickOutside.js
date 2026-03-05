/**
 * useOnClickOutside Hook
 * Detects clicks outside of a referenced element
 * 
 * @param {React.RefObject} ref - Reference to the element
 * @param {Function} handler - Callback function when click outside is detected
 */
import { useEffect } from 'react';

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      handler(e);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;

