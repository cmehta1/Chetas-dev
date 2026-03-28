# chetas.dev — Gamified Portfolio

A side-scrolling, platformer-style portfolio website where visitors control a cartoon character through Chetas Mehta's life journey — from Gujarat, India through school, college, a flight to the USA, university, and career milestones.

Inspired by [Robby Leonardi's Interactive Resume](http://www.rleonardi.com/interactive-resume/).

## Features

- **Side-scrolling gameplay** — Arrow keys or scroll wheel to navigate through 8 life zones
- **Procedural vector character** — Flat-art character drawn entirely with Phaser Graphics API, with outfit changes per life stage
- **Skill collection** — 50+ floating skill stars on the walking path, each with proficiency ratings (1-5 stars)
- **Character growth** — Character visually grows and changes outfits as you progress through stages
- **Flight cutscene** — Animated airplane sequence from India to USA
- **Building interactions** — Enter schools, colleges, and offices to trigger transitions
- **Parallax backgrounds** — Multi-layer scrolling with zone-specific themes (Indian village, campus, corporate offices)
- **HUD overlay** — Year counter, city/country with flag, skill panel, progress bar, and mini-map (all React DOM)
- **Scroll-wheel navigation** — Leonardi-style momentum scrolling with friction decay
- **Retro boot screen** — DOS-style green text loading sequence

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Shell & HUD | React 19 |
| Build Tool | Vite 8 |
| Game Engine | Phaser 3.90 |
| Bridge | EventBus (Phaser EventEmitter) |
| Graphics | Procedural (Phaser Graphics API) |

## Project Structure

```
src/
  game/
    EventBus.js              # React <-> Phaser communication
    PhaserGame.jsx            # React wrapper for Phaser canvas
    config/
      constants.js            # Zones, stages, world dimensions
      journeyData.js          # Real journey data, skills with proficiency
      gameConfig.js           # Phaser config
    scenes/
      BootScene.js            # Initial boot
      PreloaderScene.js       # Retro DOS loading screen
      GameScene.js            # Main gameplay scene
    utils/
      CharacterRenderer.js    # Procedural flat-vector character
      BackgroundRenderer.js   # Zone-specific parallax backgrounds
  components/
    HUD/
      HUD.jsx                 # HUD container
      YearCounter.jsx         # Year + city + flag display
      SkillsPanel.jsx         # Collected skills with star ratings
      MiniMap.jsx             # Zone progress nodes
      ProgressBar.jsx         # Overall journey completion
  hooks/
    useGameEvent.js           # React hook for EventBus events
  styles/
    hud.css                   # HUD styling
    index.css                 # Global styles + Poppins font
```

## Zones

| # | Zone | Location | Character Stage |
|---|------|----------|----------------|
| 0 | Hometown | Gujarat, India | Child |
| 1 | School | Gujarat, India | Student |
| 2 | College (GTU) | Gujarat, India | Undergrad |
| 3 | Flight | India to USA | Cutscene |
| 4 | University (SUNY Binghamton) | New York, USA | Grad Student |
| 5 | Midway Dental Tech | Kansas, USA | Junior Dev |
| 6 | Cerner Corporation | Kansas, USA | Engineer |
| 7 | Oracle Health | Kansas, USA | Senior Engineer |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Controls

| Input | Action |
|-------|--------|
| Arrow Left/Right | Move character |
| Arrow Up | Jump |
| Scroll Wheel | Momentum-based navigation |
| Space | Enter buildings |

## Deployment

Designed for deployment on **Vercel** with custom domain **chetas.dev** via GoDaddy DNS nameserver configuration.
