import { motion } from 'framer-motion';
import { FaTwitch, FaLink } from 'react-icons/fa';
import { streamChannels } from '@/lib/socialData';

const CallToAction = () => {
  const mainChannel = streamChannels.find(channel => channel.type === 'primary');

  return (
    <section className="py-16 bg-gradient-to-r from-secondary to-dark">
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-poppins font-bold mb-6">Ready to Join the Adventure?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Follow my channels to get notified when I go live and never miss a stream. Your support means everything!
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.a 
              href={mainChannel?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-primary rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05, backgroundColor: '#FF7733', boxShadow: '0 0 20px rgba(255, 85, 0, 0.6)' }}
            >
              <FaTwitch className="text-xl" />
              <span>Follow Main Channel</span>
            </motion.a>
            
            <motion.a 
              href="#connect" 
              className="flex items-center gap-2 px-8 py-4 bg-dark border border-gray-800 rounded-lg font-medium transition-all"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(38, 38, 38, 1)' }}
            >
              <FaLink className="text-xl" />
              <span>All Social Links</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
