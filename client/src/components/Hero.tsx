import { motion } from 'framer-motion';
import { FaTwitch, FaDiscord, FaTwitter, FaInstagram } from 'react-icons/fa';
import { socialLinks } from '@/lib/socialData';
import heroImage from '../assets/IMG_2456.png';

const Hero = () => {
  return (
    <section className="relative pt-20 overflow-hidden">
      <div className="container mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
        <motion.div 
          className="relative z-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-dark rounded-2xl overflow-hidden shadow-xl">
            <div className="relative aspect-video md:aspect-[21/9] overflow-hidden">
              <img 
                src={heroImage} 
                alt="REMAK - Content Creator" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold text-shadow mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="text-primary">RE</span>MAK
                </motion.h1>
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-2xl text-shadow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  IRL Adventures & Gaming Streams
                </motion.p>
              </div>
            </div>
            
            <div className="px-6 py-6 md:px-8 md:py-8 bg-dark">
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                {/* Social Quick Links */}
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-button flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg`}
                    style={{ 
                      backgroundColor: `${link.color}20`,
                      boxShadow: 'none'
                    }}
                    whileHover={{ 
                      y: -3, 
                      boxShadow: `0 0 15px ${link.color}99` 
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
                  >
                    {link.platform === 'twitch' && <FaTwitch className={`text-lg`} style={{ color: link.color }} />}
                    {link.platform === 'discord' && <FaDiscord className={`text-lg`} style={{ color: link.color }} />}
                    {link.platform === 'twitter' && <FaTwitter className={`text-lg`} style={{ color: link.color }} />}
                    {link.platform === 'instagram' && <FaInstagram className={`text-lg`} style={{ color: link.color }} />}
                    <span className="text-sm font-medium">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
