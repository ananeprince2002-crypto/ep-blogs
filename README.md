# EP BLOGS

A responsive news/blog website for posting articles and images.

## Features
- Professional white + royal-blue design
- EP BLOGS branding using the supplied logo
- Home page with featured story, latest stories and categories
- Ghana News, Politics, Sports, Entertainment, Education, Technology, Business and Lifestyle categories
- Search
- Individual article pages
- Admin dashboard
- Upload JPG/PNG/WEBP/GIF featured images
- Publish, list and delete stories
- Responsive mobile design
- Contact details included

## Run it on a computer
1. Install Node.js (18+ recommended).
2. Open a terminal in this folder.
3. Run:
   npm install
4. Start:
   npm start
5. Open:
   http://localhost:3000

## Admin login
Default development password:
EPBLOGS2026

For a real deployment, change it before going live:
Linux/macOS:
ADMIN_PASSWORD="your-strong-password" npm start

Windows PowerShell:
$env:ADMIN_PASSWORD="your-strong-password"; npm start

Also set a long random SESSION_SECRET in production.

## Important
This version uses a simple JSON file for posts and local image storage. It is ideal for a first working version and small deployments. For a larger public newsroom, move storage to a database + cloud image storage.

## Contact
Phone/WhatsApp: 0595514852
Email: ananeprince2002@gmail.com


## Online hosting — Render

This project includes `render.yaml` for Render deployment. The app stores posts and uploaded images under `/data`, which is configured as a persistent disk. Render documents that ordinary web-service filesystems are ephemeral and that a persistent disk is needed when filesystem changes must survive restarts/deploys. See the official Render documentation:
- https://render.com/docs/disks
- https://render.com/docs/blueprint-spec

### Deploy
1. Create a GitHub repository and upload this project.
2. In Render, choose **New → Blueprint** and connect the repository.
3. Render reads `render.yaml`.
4. When prompted for `ADMIN_PASSWORD`, choose a strong private password.
5. Deploy.
6. Open the generated `https://...onrender.com` address on Android, iPhone, Windows, Mac or any modern browser.
7. Open `/` for the public site and use **Admin Dashboard** in the footer to publish.

### Important hosting note
Render's persistent disk is available on paid web services. The free service filesystem is ephemeral, so do not use a free instance for a production news CMS that must permanently retain uploaded images/posts. Render's docs explicitly recommend persistent storage for apps such as blogging platforms.

### Domain
After deployment, a custom domain can be connected in the Render service settings. Render provides HTTPS/TLS for web services.

### Security
Do not use the development password `EPBLOGS2026` on a public deployment. Set `ADMIN_PASSWORD` to a strong unique password in the hosting dashboard. Keep `SESSION_SECRET` generated/secret.

### PWA
EP BLOGS includes a web app manifest and service worker. On supported mobile browsers, readers can add the site to their home screen.
