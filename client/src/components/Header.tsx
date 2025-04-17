import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-secondary ${
        scrolled ? 'bg-opacity-80 shadow-md' : 'bg-opacity-50'
      } border-b border-gray-900 transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-primary font-poppins text-2xl font-bold">RE<span className="text-white">MAK</span></span>
        </div>
        
        <nav>
          <ul className="flex items-center space-x-1 sm:space-x-3">
            <li>
              <a href="#streams" className="px-2 py-2 text-sm hover:text-primary transition-colors">
                Streams
              </a>
            </li>
            <li>
              <a href="#connect" className="px-2 py-2 text-sm hover:text-primary transition-colors">
                Connect
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
