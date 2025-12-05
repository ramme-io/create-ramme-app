import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A component that listens for hash changes in the URL and smoothly
 * scrolls the corresponding element into view.
 */
const HashLinkScroll = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // We need to remove the '#' from the hash string
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]); // Re-run this effect whenever the hash changes

  // This component does not render any UI
  return null;
};

export default HashLinkScroll;