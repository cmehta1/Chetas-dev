# chetas.dev — Gamified Interactive Portfolio

A side-scrolling, level-based platformer portfolio where visitors control a character through Chetas Mehta's life journey — from childhood in Gujarat, India through school, college, a flight to the USA, graduate school, career milestones, and personal hobbies.

**Live:** [chetas.dev](https://chetas.dev)

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
| 1 | Early Days | 0-1 (Childhood + School) | Horizontal walk/run on terrain | Toddler → School Kid |
| 2 | Bachelors | 2-3 (GTU + Flight) | Campus walk + flight cutscene | College Student |
| 3 | Masters | 4 (SUNY Binghamton) | Autumn campus walk with snow/leaf particles | Grad Student |
| 4 | Career | 5-7 (Midway + Cerner + Oracle) | Corporate walk with zone-specific buildings | Engineer → Senior Engineer |
| 5 | Hobbies | 8 (Hobbies & Interests) | Park walk with 9 interactive hobby stations | Senior Engineer |

### Zone Map

| Zone | Name | Location | Theme |
|------|------|----------|-------|
| 0 | Childhood | Gujarat, India | Indian town with townhouses, temples, shop fronts |
| 1 | School Years | Gujarat, India | School compound with bell tower, Indian flag |
| 2 | Gujarat Tech University | Gujarat, India | College campus with hostel, library, canteen, flagpole, cycle stand |
| 3 | Flight to USA | India to USA | Night sky with animated airplane cutscene |
| 4 | SUNY Binghamton | Binghamton, NY | Autumn campus with tall NY-style buildings, clock tower, snow |
| 5 | Midway Dental Supply | Livonia, MI | Sandstone office with arched windows, columns, tooth logo |
| 6 | Cerner Corporation | Kansas City, MO | Multi-wing corporate campus with glass atrium, healthcare cross |
| 7 | Oracle Health | Overland Park, KS | Dark glass tower with podium base, red Oracle branding, spire |
| 8 | Hobbies & Interests | Life | Colorful park with interactive hobby stations |

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
- **Level-based progression** — 5 distinct levels with cinematic transitions and carried state
- **Skill collection** — 30+ floating skill stars with proficiency ratings (1-5 stars), shown above character on pickup
- **Character growth** — Character visually grows through 6 stages (Toddler → Senior Engineer) with stage-appropriate outfits
- **Auto-jump system** — Spring pads at terrain transitions trigger jumps when the player is moving
- **Building interactions** — Enter schools, colleges, and offices (SPACE key / tap) to view detailed interior content with scroll-based 3D room
- **Hobby discovery** — 9 interactive hobby stations in Level 5: Cricket, Football, Boxing, Tennis, Chess, Space Science, Drawing, Coding, Gaming
- **Minimap navigation** — Click any node on the minimap to jump directly to that zone
- **Certification banners** — Oracle zone displays certification badges that descend on cables as the player approaches

### Character System
- **Multi-joint articulation** — Two-part legs (thigh + shin with knee pivot) and arms (upper arm + forearm with elbow pivot)
- **Realistic walk animation** — Asymmetric knee drive (strong push-off on back leg, slight bend on front contact), arm pump with elbow flex, torso twist, vertical bounce, and shadow pulse
- **Idle animation** — Breathing motion, subtle weight shift, gentle arm sway
- **Stage-specific details** — Outfit colors, collar/tie (school), backpack (college), ID badge and glasses (professional), button-down shirt details
- **6 outfit stages** — Red casual → White uniform with tie → Blue college → Green GTU → Blue corporate → Red Oracle

### Visual Design
- **Procedural vector art** — All graphics drawn with Phaser Graphics API (zero sprite/image assets)
- **HD canvas rendering** — 2x canvas scale (2560x1440) with camera zoom for crisp Retina display
- **Zone-themed architecture** — Indian townhouses and temples (childhood), campus blocks with domes and balconies (GTU), tall NY-style buildings with water tanks (Binghamton), glass towers (corporate)
- **Detailed enterable buildings** — GTU building with wings, dome, columns, and gear logo; BU building with clock tower, copper spire, ivy, and American flag; Midway with sandstone facade, arched windows, and columned entrance; Cerner with multi-wing campus, glass atrium, and heartbeat logo; Oracle with podium base, stepped crown, revolving door, and concentric ring logo
- **GTU campus elements** — Brick entrance gate with arch and lamps, notice board, cycle stand, Indian tricolor flagpole, hostel with balconies, library with dome, open canteen, L-shaped department block
- **Parallax scrolling** — Multi-layer sky gradients, clouds, and celestial bodies with depth-based scroll rates
- **Weather particles** — Snow and falling leaves in Level 3 (Binghamton autumn)
- **Terrain system** — Linear-interpolated ground surface with per-zone elevation profiles and 400px-thick collision platform

### Building Interior (3D Room)
- **Scroll-driven 3D perspective** — Isometric room with floor, walls, desk, chair, monitor, bookshelf, and plant rendered in CSS
- **Zone-specific content** — Academic projects for school/college zones, work experience with bullet points for career zones, hobby descriptions for zone 8
- **Smooth entry/exit** — Fade transitions when entering and leaving buildings

### HUD (React DOM Overlay)
- **Year counter** — Current year with city name and country flag emoji
- **Level indicator** — Current level number and name (hidden until first level starts)
- **Skills panel** — Collected skills with star ratings, highlighted flash on new acquisition
- **Projects/Experience panel** — Zone-specific content (academic projects, work experience, hobbies)
- **Progress bar** — Overall journey completion percentage
- **Minimap** — 9-node clickable progress tracker with level grouping labels and jump-to-zone navigation

### Mobile Support
- **Portrait-optimized view** — ENVELOP scaling fills the screen with a zoomed-in view centered on the character
- **Touch joystick** — Left, Right, and Jump buttons with safe-area support for notched devices
- **Toggleable panels** — Skills and Projects panels hidden by default on mobile, accessible via toggle buttons
- **Adaptive camera** — Extended camera bounds keep the character centered in the visible area
- **Tap to enter** — Building interaction prompts adapt between keyboard and touch

### End Scene
- **Dancing character** — Animated dance loop with bounce, leg swing, and arm wave
- **Social links** — LinkedIn, X (Twitter), and GitHub with drawn vector icons
- **Confetti particles** — Floating multicolor confetti animation
- **"Chetas" watermark** — Always visible at bottom-right across all scenes

---

## Technical Details

### Rendering Pipeline
- Game canvas renders at `GAME_WIDTH * CANVAS_SCALE` (1280 x 2 = 2560) for HD quality
- Camera `setZoom(CANVAS_SCALE)` scales the viewport back to logical 1280x720
- Static scenes (Preloader, LevelTransition, End) use `camera.centerOn()` to correct zoom offset
- Level scenes use `camera.startFollow()` which handles positioning automatically

### Physics & Terrain
- Arcade Physics with gravity (900) and immovable ground platform
- Ground platform is 400px thick (prevents fall-through on steep slopes)
- Safety clamp resets player position if they somehow pass below terrain surface
- Terrain defined as array of `[x, y]` control points with linear interpolation between them
- Auto-jump triggers at terrain elevation changes with configurable velocity

### State Management
- Scene-to-scene state transfer via `init(data)` with `collectedKeys`, `skillProficiency`, `playerStage`
- EventBus (Phaser EventEmitter) bridges game state to React HUD components
- Custom `useGameEvent` hook for React components to subscribe to game events
- Minimap jump navigation: EventBus event → PhaserGame listener → scene stop → LevelTransition → target scene

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
    PhaserGame.jsx               # React wrapper + minimap jump listener
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
      CharacterRenderer.js       # Multi-joint character with walk/idle animation
      BackgroundRenderer.js      # Zone-specific backgrounds, buildings, weather, terrain
  components/
    HUD/
      HUD.jsx                    # HUD container with mobile toggle logic
      YearCounter.jsx            # Year + city + flag display
      SkillsPanel.jsx            # Collected skills with star ratings
      ProjectsPanel.jsx          # Projects, experience, or hobbies per zone
      MiniMap.jsx                # 9-node clickable journey progress tracker
      ProgressBar.jsx            # Overall journey completion bar
      LevelIndicator.jsx         # Current level number and name
      Joystick.jsx               # Mobile touch controls (left, right, jump)
    BuildingInterior/
      BuildingInterior.jsx       # 3D room interior with scroll-driven content
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
| Tap building prompt | Enter building (mobile) |
| Click minimap node | Jump to zone |

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

- **Font:** [Poppins](https://fonts.google.com/specimen/Poppins) (Google Fonts)
- **Built by:** Chetas Mehta — [chetas.dev](https://chetas.dev)
