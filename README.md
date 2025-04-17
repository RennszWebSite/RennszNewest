# Rennsz Streamer Landing Page

A responsive streamer landing page with orange and black theme showcasing all Rennsz social media links.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Orange and black themed UI with animated components
- Sections for:
  - Hero with streamer image
  - Twitch stream channels (primary and secondary)
  - Social media connections
  - Call to action

## Tech Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS with shadcn/ui components
- Animations: Framer Motion
- Build: Vite
- Server: Express.js

## Deployment to Render

This project is configured for easy deployment on Render.com:

1. Fork or clone this repository
2. Connect your GitHub account to Render
3. Create a new Web Service on Render
4. Choose "Deploy from GitHub repository"
5. Select the repository
6. Render will automatically detect the configuration from `render.yaml`
7. Click "Create Web Service"

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Serve production build locally
npm run start
```

## Customization

- Update social media links in `client/src/lib/socialData.ts`
- Modify theme colors in `theme.json`
- Replace images in `client/src/assets/`

## Credits

- Made with ♥️ by sf.xen on discord