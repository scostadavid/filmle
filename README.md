# 🎬 Filmle

A fun, minimalist word-guessing game inspired by Wordle — but for movies. Each day, players are challenged to guess a movie using only emojis and progressively revealed hints. No downloads, no accounts, just a browser and your movie knowledge.

> Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)

## 🧰 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Deployment:** Cloudflare Pages
- **Storage:** Cloudflare KV (WIP)
- **CI/CD:** GitHub Actions (WIP)

## ✨ Features

- 🧠 Daily movie guessing game
- 🎯 Clues via emojis and textual hints
- 🔄 Multilingual (English 🇺🇸 and Portuguese 🇧🇷)
- 📝 Fuzzy match support (typo tolerance)
- 🕐 Countdown for the next challenge
- 🔗 Share your win on Twitter/X
- 🍪 State saved via cookies/localStorage (no backend needed)
- 🔎 SEO-optimized static site
- 📱 Mobile-first design

## 🚀 Getting Started (Local)

1. Clone the repo:

```bash
git clone https://github.com/scostadavid/filmle.git
cd filmle
```

2. Serve with any local server (e.g., [`serve`](https://www.npmjs.com/package/serve) or Vite):

```bash
# with serve
npx serve .

# or with Vite (optional, overkill for prod but great for dev DX)
npm create vite@latest filmle --template vanilla
npm run dev
```

## 🌐 Hosting

The site is deployed on [Cloudflare Pages](https://pages.cloudflare.com/).  
Daily challenges are fetched dynamically from a Cloudflare Worker using KV storage (WIP).

## 🧪 Example Challenge Format (in KV)

```json
{
  "date": "2025-04-17",
  "emojis": ["🦁", "👑", "🎵"],
  "answers": {
    "en": ["the lion king", "lion king"],
    "pt": ["o rei leão", "rei leão"]
  },
  "hints": {
    "en": [
      "Disney animated movie",
      "Based on a Shakespeare play",
      "Famous song: 'Hakuna Matata'"
    ],
    "pt": [
      "Filme animado da Disney",
      "Baseado em peça de Shakespeare",
      "Música famosa: 'Hakuna Matata'"
    ]
  },
}
```

## 📈 Roadmap

- [x] Daily movie guessing logic
- [x] Emoji UI and hint system
- [x] Language toggle (EN/PT via query param)
- [x] LocalStorage/cookie state handling
- [ ] KV Storage
- [ ] CI/CD 

## 📂 Project Structure (WIP)

```     
├── index.html           # Main HTML file
├── style.css            # Global styles
├── main.js              # Game logic
├── /public              # Static assets (e.g. favicon, poster fallback)
├── /workers             # Cloudflare Worker for KV
```

## 🧑‍💻 Author

- **David S. Costa**  
  [Email](mailto:me@scostadavid.dev) • [GitHub](https://github.com/scostadavid) • [Website](https://scostadavid.dev) • [LinkedIn](https://linkedin.com/in/scostadavid)

---

> Filmle is an indie, minimalist project designed to bring joy to movie lovers. feedback are welcome!
