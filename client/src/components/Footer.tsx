import { FaTwitch, FaDiscord, FaTwitter, FaInstagram } from 'react-icons/fa';
import { socialLinks } from '@/lib/socialData';

const Footer = () => {
  return (
    <footer className="py-8 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-lg font-poppins font-bold">
              <span className="text-primary">RE</span>MAK
            </p>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>
          
          <div className="flex gap-4">
            {socialLinks.map(link => (
              <a 
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label={`REMAK on ${link.name}`}
              >
                {link.platform === 'twitch' && <FaTwitch className="text-xl" />}
                {link.platform === 'discord' && <FaDiscord className="text-xl" />}
                {link.platform === 'twitter' && <FaTwitter className="text-xl" />}
                {link.platform === 'instagram' && <FaInstagram className="text-xl" />}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
