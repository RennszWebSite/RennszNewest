import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 85, 0, 0.6)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <FaArrowUp className="text-xl" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
