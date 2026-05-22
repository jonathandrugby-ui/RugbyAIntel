# RugbyAI — Coach Cockpit

A mid-fidelity interactive prototype for a rugby team management platform, built for **Warwick Pumas RFC**.

Built with React 18 + Babel (no build step — open `midfi.html` directly in a browser or serve with any static file server).

---

## Screens

| Screen | File | Description |
|---|---|---|
| Season Dashboard | `midfi/dashboard.jsx` | Season at a glance — record, form chart, next fixture, radar |
| Squad List | `midfi/squad.jsx` | 27-player roster with fitness, contract & commitment status |
| Match Day | `midfi/match-day.jsx` | Pre-match team sheet builder |
| Match Ratings | `midfi/ratings.jsx` | Post-match player performance ratings |
| Season Calendar | `midfi/calendar.jsx` | Full fixture calendar with practice session markers |
| Practice Planner | `midfi/practice.jsx` | Inline-editable session builder — drills, timings, coaches, priority |
| Opponent Intel | `midfi/opponent.jsx` | Scouting cards per opposition team |
| Video Clips | `midfi/video.jsx` | Tagged clip library with match footage review |
| Playbook | `midfi/playbook.jsx` | Interactive pitch board with draggable player tokens + phase play presets |
| AI Analyst | `midfi/analyst.jsx` | Full-screen AI assistant page |
| Season Setup | `midfi/onboarding.jsx` | Club setup with logo upload + live brand colour extraction |

## Features

- **Floating AI chat widget** — accessible from every screen, contextual responses from real squad & fixture data
- **Inline drill editing** — click any cell in the practice table to edit (name, duration, focus, coaches, priority)
- **Live brand theming** — upload a club logo in Season Setup and the whole app re-skins to match extracted brand colours
- **Interactive Playbook** — drag player tokens, draw run/pass/kick arrows, 4 preset formations
- **4 team palettes** — Pumas (navy/gold), Forest (green), Maroon, Sky — switchable in the Tweaks panel
- **Density modes** — Compact / Regular / Comfy row density

## Running locally

```bash
# Any static file server works, e.g.:
python3 -m http.server 3000
# then open http://localhost:3000/midfi.html
```

## File structure

```
├── midfi.html              # Entry point — loads all scripts
├── tweaks-panel.jsx        # Shared Tweaks panel component
├── midfi/
│   ├── styles.css          # All CSS (custom properties, layouts, components)
│   ├── shell.jsx           # Sidebar, TopBar, shared data (SQUAD, FIXTURES)
│   ├── data.jsx            # usePractices hook + drill seed data
│   ├── app.jsx             # App router
│   ├── ai-chat.jsx         # Floating AI chat widget
│   ├── dashboard.jsx
│   ├── squad.jsx
│   ├── match-day.jsx
│   ├── match-live.jsx
│   ├── ratings.jsx
│   ├── calendar.jsx
│   ├── practice.jsx
│   ├── opponent.jsx
│   ├── video.jsx
│   ├── playbook.jsx
│   ├── analyst.jsx
│   └── onboarding.jsx
├── netlify.toml            # Netlify deployment config
└── netlify/functions/      # Serverless functions (Claude API proxy)
```

## Stack

- **React 18** (UMD, no build step)
- **Babel Standalone** (JSX transpiled in-browser)
- **Geist + Bricolage Grotesque + JetBrains Mono** (Google Fonts)
- **CSS custom properties** for full theming
- **HTML5 Canvas** for logo colour extraction
