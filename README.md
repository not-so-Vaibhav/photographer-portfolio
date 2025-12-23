# Photography Portfolio - not_so_graphy

Professional photography portfolio website for Vaibhav Bariyar.

## Features

- 🎨 Modern, professional design with dark theme
- 📸 Image gallery with lazy loading
- 🔍 Explore More modal with lightbox view
- 📧 Contact form with backend integration
- 📱 Fully responsive design
- ⚡ Optimized for performance
- 🎭 Smooth animations with GSAP

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Gmail credentials:
   - For Gmail, you'll need to use an "App Password" instead of your regular password
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate an app password and use it in `EMAIL_PASS`

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Project Structure

```
photographer-portfolio/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── app.js              # Frontend JavaScript
├── server.js           # Backend server (Express)
├── package.json        # Node.js dependencies
├── .env                # Environment variables (create from .env.example)
└── images/             # Image assets
```

## API Endpoints

### POST `/api/contact`

Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your photography services."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Email:** Nodemailer
- **Animations:** GSAP (GreenSock)
- **Icons:** Custom PNG icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

## Contact

- Email: notsography@gmail.com
- Instagram: [@not_so_graphy](https://www.instagram.com/not_so_graphy)
- Location: Pune, India

