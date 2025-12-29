import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" prevents the user from seeing the page scroll up
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', 
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;