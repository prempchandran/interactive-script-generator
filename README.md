# Interactive Script Generator

Transform web content into comic storyboards and short film scripts using AI.

Created by **Prem Chandran**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)

## Features

- **Content Extraction** — Fetch and analyze any web article, blog post, or written content
- **14 Genre Options** — Horror, Comedy, Thriller, Drama, Sci-Fi, Romance, and more
- **Complete Output** — Get synopsis, 6-8 panel storyboard, formatted screenplay, and production notes
- **Mobile Responsive** — Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

You'll need an Anthropic API key to use this app.

**Get your API key:**
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Navigate to **API Keys** in the sidebar
4. Click **Create Key** and copy it

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/interactive-script-generator.git
cd interactive-script-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/interactive-script-generator)

### Option 2: Manual Deploy

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

## How to Use

1. **Enter your API key** — Your Anthropic API key (never stored)
2. **Paste a URL** — Any article, blog post, or web content
3. **Extract & preview** — Review the content summary before proceeding
4. **Choose a genre** — Select from 14 adaptation styles
5. **Generate** — Get a complete adaptation package

## Available Genres

- Horror
- Comedy
- Teen Romance
- Thriller
- Drama
- Science Fiction
- Mystery
- Action/Adventure
- Fantasy
- Documentary-Style
- Musical
- Noir
- Satire
- Coming-of-Age

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Claude AI** — Content generation via Anthropic API

## Project Structure

```
interactive-script-generator/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Privacy

- Your API key is used only during your session
- No data is stored on any server
- All API calls are made directly from your browser to Anthropic

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

**Prem Chandran**

---

Powered by [Claude AI](https://www.anthropic.com/claude) from Anthropic
