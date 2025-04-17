import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Streams from '@/components/Streams';
import Connect from '@/components/Connect';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Home = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function() {});
      });
    };
  }, []);

  return (
    <div className="font-inter text-white">
      <Header />
      <Hero />
      <Streams />
      <Connect />
      <CallToAction />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Home;
