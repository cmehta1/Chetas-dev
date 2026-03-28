# chetas.dev — Gamified Interactive Portfolio

A side-scrolling, level-based platformer portfolio where visitors control a cartoon character through Chetas Mehta's life journey — from childhood in Gujarat, India through school, college, a flight to the USA, graduate school, career milestones, and personal hobbies.

**Live:** [chetas.dev](https://chetas.dev)

Inspired by [Robby Leonardi's Interactive Resume](http://www.rleonardi.com/interactive-resume/).

---

## Architecture

```
React 19 (HUD / UI Shell)
    |
    EventBus (Phaser.Events.EventEmitter)
    |
Phaser 3.90 (Game Engine / Rendering)
```

React handles the DOM-based HUD overlay (skills panel, progress bar, minimap, year counter). Phaser handles all in-game rendering, physics, and scene management. The two communicate through an EventBus — Phaser scenes emit events (`skill-collected`, `zone-changed`, `level-changed`) that React components subscribe to via custom hooks.

---

## Level System

The game is split into 5 distinct levels, each a separate Phaser scene with its own gameplay mechanics, backgrounds, and progression logic.

| Level | Name | Zones | Gameplay | Stages |
|-------|------|-------|----------|--------|
| 1 | Early Days | 0-1 (Childhood + School) | Horizontal walk/run on path | Toddler → School Kid |
| 2 | Bachelors | 2-3 (GTU + Flight) | Walk + flight cutscene | College Student |
| 3 | Masters | 4 (SUNY Binghamton) | Autumn campus walk with snow/leaf particles | Grad Student |
| 4 | Career | 5-7 (Midway + Cerner + Oracle) | Corporate walk with zone-specific buildings | Engineer → Senior Engineer |
| 5 | Hobbies | 8 (Hobbies & Interests) | Park walk with 9 interactive hobby stations | Senior Engineer |

### Zone Map

| Zone | Name | Location | Theme |
|------|------|----------|-------|
| 0 | Childhood | Gujarat, India | Indian village with huts, neem trees, temple |
| 1 | School Years | Gujarat, India | School compound with bell tower, Indian flag |
| 2 | Gujarat Tech University | Gujarat, India | College campus with columns, GTU gear logo |
| 3 | Flight to USA | India to USA | Night sky with animated airplane cutscene |
| 4 | SUNY Binghamton | Binghamton, NY | Autumn campus with clock tower, BU logo, snow |
| 5 | Midway Dental Supply | Livonia, MI | Suburban office with tooth logo |
| 6 | Cerner Corporation | Kansas City, MO | Corporate campus with glass buildings, cross logo |
| 7 | Oracle Health | Overland Park, KS | Tech hub with dark glass tower, red Oracle logo |
| 8 | Hobbies & Interests | Life | Colorful park with hobby stations |

### Scene Flow

```
PreloaderScene (retro DOS boot)
  → LevelTransitionScene ("LEVEL 1: Early Days")
    → Level1Scene → LevelTransitionScene(L2)
      → Level2Scene → LevelTransitionScene(L3)
        → Level3Scene → LevelTransitionScene(L4)
          → Level4Scene → LevelTransitionScene(L5)
            → Level5Scene → EndScene (Let's Connect)
```

State carried between scenes: `{ collectedKeys, skillProficiency, playerStage }`

---

## Features

### Gameplay
- **Level-based progression** — 5 distinct levels with transitions and carried state
- **Skill collection** — 30+ floating skill stars with proficiency ratings (1-5 stars), shown above character on pickup
- **Character growth** — Character visually grows through 6 stages (Toddler → Senior Engineer)
- **Auto-jump system** — Spring pads at terrain transitions trigger jumps when the player is moving
- **Building interactions** — Enter schools, colleges, and offices (SPACE key) to trigger level transitions
- **Hobby discovery** — 9 interactive hobby stations in Level 5: Cricket, Football, Boxing, Tennis, Chess, Space Science, Drawing, Coding, Gaming

### Visual Design
- **Procedural vector art** — All graphics drawn with Phaser Graphics API (no sprite assets)
- **Rotation-based walk animation** — Limbs rotate at hip/shoulder pivots with torso lean and head bob
- **Distinct buildings with logos** — GTU (gear logo), BU (clock tower + BU emblem), Midway (tooth), Cerner (green cross), Oracle (red O)
- **Zone-specific backgrounds** — Indian village, school, college, night sky, autumn campus, suburban office, corporate park, tech hub, hobby park
- **Parallax clouds** — Multi-speed cloud layers per zone
- **Weather particles** — Snow and falling leaves in Level 3 (Binghamton)
- **Terrain system** — Linear-interpolated ground surface with elevation changes per zone

### HUD (React DOM Overlay)
- **Year counter** — Current year with city name and country flag
- **Level indicator** — Current level number and name
- **Skills panel** — Collected skills with star ratings, highlighted on new acquisition
- **Projects/Experience panel** — Zone-specific content (academic projects for school zones, work experience for career zones, hobbies for zone 8)
- **Progress bar** — Overall journey completion percentage
- **Minimap** — 9-node progress tracker with level grouping labels

### Mobile Support
- **Portrait-optimized view** — ENVELOP scaling fills the screen with a zoomed-in view centered on the character
- **Touch joystick** — Left, Right, and Jump buttons with safe-area support for notched devices
- **Toggleable panels** — Skills and Projects panels hidden by default on mobile, accessible via toggle buttons
- **Adaptive camera** — Extended camera bounds keep the character centered in the visible area
- **HD text rendering** — All Phaser text objects render at device pixel ratio for Retina sharpness

### End Scene
- **Dancing character** — Animated dance loop with bounce, leg swing, and arm wave
- **Social links** — LinkedIn, X (Twitter), GitHub, Instagram with drawn vector icons
- **Confetti particles** — Floating multicolor confetti animation
- **"Chetas" watermark** — Always visible at bottom-right across all scenes

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Shell & HUD | React 19 | DOM overlay for HUD panels, toasts, toggles |
| Build Tool | Vite 8 | Fast dev server and production bundling |
| Game Engine | Phaser 3.90 | Arcade physics, scene management, rendering |
| Bridge | EventBus | Phaser ↔ React communication via EventEmitter |
| Graphics | Phaser Graphics API | All procedural vector art, no sprite assets |
| Hosting | Vercel | Auto-deploy from GitHub on push |
| Domain | chetas.dev | Custom domain via GoDaddy DNS |

---

## Project Structure

```
src/
  game/
    EventBus.js                  # React <-> Phaser communication
    PhaserGame.jsx               # React wrapper for Phaser canvas
    config/
      constants.js               # Zones, terrain, stages, world dimensions, mobile helpers
      journeyData.js             # Skills, projects, experience, hobbies, languages
      levelConfig.js             # Level definitions, auto-jump triggers
      gameConfig.js              # Phaser engine config (scale, physics, scenes)
    scenes/
      BootScene.js               # HD text patch + boot
      PreloaderScene.js          # Retro DOS-style loading screen
      LevelTransitionScene.js    # "LEVEL X: Name" interstitial (2.5s)
      Level1Scene.js             # Childhood + School (zones 0-1)
      Level2Scene.js             # GTU + Flight (zones 2-3)
      Level3Scene.js             # SUNY Binghamton (zone 4)
      Level4Scene.js             # Career: Midway + Cerner + Oracle (zones 5-7)
      Level5Scene.js             # Hobbies & Interests (zone 8)
      EndScene.js                # Let's Connect with social links
    utils/
      CharacterRenderer.js       # Procedural flat-vector character with walk animation
      BackgroundRenderer.js      # Zone-specific backgrounds, buildings, weather
  components/
    HUD/
      HUD.jsx                    # HUD container with mobile toggle logic
      YearCounter.jsx            # Year + city + flag display
      SkillsPanel.jsx            # Collected skills with star ratings
      ProjectsPanel.jsx          # Projects, experience, or hobbies per zone
      MiniMap.jsx                # 9-node journey progress tracker
      ProgressBar.jsx            # Overall journey completion bar
      LevelIndicator.jsx         # Current level number and name
      Joystick.jsx               # Mobile touch controls (left, right, jump)
  hooks/
    useGameEvent.js              # React hook for EventBus subscriptions
  styles/
    hud.css                      # HUD styling, mobile media queries, joystick, watermark
    index.css                    # Global styles, Poppins font, safe-area support
```

---

## Controls

| Input | Action |
|-------|--------|
| Arrow Left / Right | Move character |
| Arrow Up | Jump |
| Scroll Wheel | Momentum-based navigation |
| Space | Enter buildings |
| Touch Left / Right buttons | Move (mobile) |
| Touch Up button | Jump (mobile) |
| Tap screen | Start game (mobile) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deployment

Hosted on **Vercel** with auto-deploy on push to `main`. Custom domain **chetas.dev** configured via GoDaddy DNS nameservers pointing to Vercel.

```
GitHub (cmehta1/Chetas-dev) → push to main → Vercel auto-build → chetas.dev
```

### Vercel Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Root Directory:** `/` (repo root)

---

## Credits

- **Design Inspiration:** [Robby Leonardi's Interactive Resume](http://www.rleonardi.com/interactive-resume/)
- **Font:** [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
- **Built by:** Chetas Mehta — [chetas.dev](https://chetas.dev)
