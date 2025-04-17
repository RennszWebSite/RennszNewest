export interface SocialLink {
  platform: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  username: string;
  description: string;
}

export interface StreamChannel {
  name: string;
  type: 'primary' | 'secondary';
  description: string;
  platform: string;
  url: string;
  color: string;
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'twitch',
    name: 'Twitch',
    url: 'https://twitch.tv/rennsz',
    icon: 'twitch',
    color: '#9146FF',
    username: '@rennsz',
    description: 'Live streams & past broadcasts'
  },
  {
    platform: 'discord',
    name: 'Discord',
    url: 'https://discord.gg/rennsz',
    icon: 'discord',
    color: '#5865F2',
    username: 'Rennsz Community',
    description: 'Join our growing community'
  },
  {
    platform: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com/rennsz',
    icon: 'twitter',
    color: '#1DA1F2',
    username: '@rennsz',
    description: 'Updates & announcements'
  },
  {
    platform: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/rennsz',
    icon: 'instagram',
    color: '#E1306C',
    username: '@rennsz',
    description: 'Photos & behind the scenes'
  }
];

export const streamChannels: StreamChannel[] = [
  {
    name: 'IRL Adventures',
    type: 'primary',
    description: 'Join me as I explore real-world adventures, travel to new destinations, and share unique experiences. From urban exploration to outdoor activities.',
    platform: 'twitch',
    url: 'https://twitch.tv/rennsz',
    color: '#9146FF'
  },
  {
    name: 'Gaming & Chill',
    type: 'secondary',
    description: 'Relaxed gaming sessions featuring a variety of titles from competitive to casual. Come hang out, chat, and enjoy some gameplay in a more laid-back environment.',
    platform: 'twitch',
    url: 'https://twitch.tv/rennszino',
    color: '#9146FF'
  }
];
