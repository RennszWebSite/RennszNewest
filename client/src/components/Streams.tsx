import { motion } from 'framer-motion';
import { FaTwitch, FaCalendarAlt, FaGamepad } from 'react-icons/fa';
import { streamChannels } from '@/lib/socialData';

const Streams = () => {
  return (
    <section id="streams" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-poppins font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary">/</span> My Streams <span className="text-primary">/</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {streamChannels.map((channel, index) => (
            <motion.div 
              key={channel.name}
              className="stream-card gradient-border rounded-xl bg-dark overflow-hidden transition-all duration-300 hover:shadow-glow group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-poppins font-bold">{channel.name}</h3>
                    <p className="text-gray-400 text-sm">{channel.type === 'primary' ? 'Main Channel' : 'Secondary Channel'}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${channel.type === 'primary' ? 'bg-primary/10' : 'bg-gray-800'} px-3 py-1 rounded-full`}>
                    <span className={`w-2 h-2 rounded-full ${channel.type === 'primary' ? 'bg-primary animate-pulse' : 'bg-gray-400'}`}></span>
                    <span className={`text-xs font-medium ${channel.type === 'primary' ? 'text-primary' : 'text-gray-300'}`}>
                      {channel.type === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  {channel.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-transform hover:translate-y-[-2px]`}
                    style={{ 
                      backgroundColor: channel.type === 'primary' ? channel.color : `${channel.color}B3` 
                    }}
                  >
                    <FaTwitch className="text-lg" />
                    <span>Follow on Twitch</span>
                  </a>
                  <a 
                    href="#connect" 
                    className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-700 rounded-lg font-medium transition-all hover:bg-gray-800"
                  >
                    {channel.type === 'primary' ? (
                      <>
                        <FaCalendarAlt className="text-lg" />
                        <span>Other Channels</span>
                      </>
                    ) : (
                      <>
                        <FaGamepad className="text-lg" />
                        <span>Gaming Content</span>
                      </>
                    )}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Streams;
