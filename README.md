# 🎬 SPIRIT BURST: THE LAST FIGHTER

> A 90s Vintage Anime Cinematic Landing Page & Interactive 2D Fight Engine.

This interactive website showcases a 90s vintage anime aesthetic (inspired by classic combat series like *Dragon Ball Z* and *Yu Yu Hakusho*) blended with modern high-quality digital animation effects.

## 🔗 Live Demo
Experience the vintage CRT playback and energy scanner live:
👉 **[Live Demo on GitHub Pages](https://asia17242.github.io/0602-2-movie/)**

---

## 🛠️ Features Built

### 1. 2D Arcade Fight Animation Engine 🎮
- **Pure JavaScript & Canvas Simulation**: An automated 16-bit arcade combat sequence featuring Goku and Yusuke Urameshi.
- **Dynamic Combat Action**:
  - Goku punches, kicks, charges his gold aura, turns **Super Saiyan** (changing hair to gold), and fires a massive **Kamehameha**.
  - Yusuke Urameshi dashes, punches, charges energy at his fingertip, and launches his signature **Spirit Gun (Reigan)**.
  - When energy beams clash in mid-air, they trigger screen-wide flash explosions, camera shakes, and speedlines.
- **Real-Time Sound Synthesis**: Uses the browser's Web Audio API to play synchronized impact sounds, electrical charges, and blast explosions.

### 2. Retro CRT / VHS TV Filter 📺
- **TV Cabinet Bezels**: Custom-designed television frame with a responsive power indicator LED light (red when idle, green when playing).
- **VHS OSD (On-Screen Display)**: Phosphor green monospace overlay displaying active playback state (`PLAY ▶` or `PAUSE ‖`) and tape counter down to milliseconds.
- **Rolling Scanlines & Flicker**: Dynamic rolling noise and screen flickering to simulate cathode-ray tube rendering.
- **System Remote Console**: Floating remote control cartridge panel allowing users to toggle CRT overlays, adjust master volume, and adjust scanline velocity.

### 3. DBZ-Style Spirit Scouter v1.96 📟
- Enter a fighter's name and select their emotion to calculate their exact power level.
- **Deterministic calculation**: The same name always yields the exact same power level.
- **HUD Overload Alert**: If a power level exceeds `90,000`, the scouter HUD turns warning red and sounds a critical alert alarm!
- **Easter Eggs**: Secret names trigger custom power levels and descriptions:
  - `"Goku"` / `"Kakarot"`: `90,001` (Super Saiyan overload)
  - `"Vegeta"`: `89,999` (Royal Blue energy)
  - `"Yusuke"`: `120,000` (Mazoku cyan spirit energy)
  - `"Hiei"`: `95,000` (Dark Dragon Black Flame)
  - `"Antigravity"`: `999,999` (Infinite Agentic Aura)

### 4. Interactive Background Particles ✨
- Floating kinetic neon particles (gold, cyan, purple) flowing upwards representing spiritual aura, which gently disperse and repel when interacting with the mouse cursor.

---

## 📂 Project Structure

```
├── index.html              # Main HTML layout, scouter HUD, and VHS cabinet elements
├── style.css               # Vanilla CSS styling, keyframes, CRT filters, glassmorphic layout
├── app.js                  # 2D fight loop engine, scouter seeded logic, and audio synthesizers
├── anime_warrior_aura.png  # Generated 4K premium vintage anime hero artwork
└── teaser.mp4              # Backup local test video file
```

---

## 🚀 How to Run Locally

1. Clone or download the repository to your local drive.
2. Open terminal in the directory and run Python's built-in server:
   ```bash
   python -m http.server 8000
   ```
3. Open your browser and go to: **`http://localhost:8000/`**
4. Open the floating **Console** panel on the bottom right and switch **Aura Hum Synth** to **ON** to enable the synthesized audio effects!
