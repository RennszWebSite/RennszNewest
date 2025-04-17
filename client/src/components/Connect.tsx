import { motion } from 'framer-motion';
import { FaTwitch, FaDiscord, FaTwitter, FaInstagram } from 'react-icons/fa';
import { socialLinks } from '@/lib/socialData';

const Connect = () => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitch':
        return <FaTwitch className="text-3xl" style={{ color: socialLinks.find(s => s.platform === platform)?.color }} />;
      case 'discord':
        return <FaDiscord className="text-3xl" style={{ color: socialLinks.find(s => s.platform === platform)?.color }} />;
      case 'twitter':
        return <FaTwitter className="text-3xl" style={{ color: socialLinks.find(s => s.platform === platform)?.color }} />;
      case 'instagram':
        return <FaInstagram className="text-3xl" style={{ color: socialLinks.find(s => s.platform === platform)?.color }} />;
      default:
        return null;
    }
  };

  return (
    <section id="connect" className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-poppins font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary">/</span> Connect With Me <span className="text-primary">/</span>
        </motion.h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {socialLinks.map((link, index) => (
            <motion.a 
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card flex flex-col items-center p-6 bg-dark rounded-xl transition-all duration-300 hover:shadow-glow group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-transform"
                style={{ backgroundColor: `${link.color}33` }}
                whileHover={{ scale: 1.1 }}
              >
                {getSocialIcon(link.platform)}
              </motion.div>
              <h3 className="text-xl font-poppins font-bold mb-1">{link.name}</h3>
              <p className="text-sm text-gray-400 mb-4 text-center">{link.description}</p>
              <span 
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${link.color}33`,
                  color: link.color
                }}
              >
                {link.username}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Connect;
