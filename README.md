# TalentScope Individual Portal

Vanilla JavaScript application served as static files. The active development experience is the Individual portal; authentication and other portals are not implemented.

## Runtime

- `index.html` loads `styles.css`, the Lucide browser bundle, and `src/app/app.js` as classic scripts.
- `src/app/app.js` contains the active shell, dashboard rendering, Home page sections, interactions, sidebar navigation, and hash-based page switching.
- `src/pages/individual/skills/SkillIntelligence.js` and its stylesheet provide the dedicated Skill Intelligence page loaded by the active app when that route is opened.
- `styles.css` imports the shared styles and Individual page styles, including `src/pages/individual/home/home.css` and `src/pages/individual/skills/skill-intelligence.css`.
- `src/components/`, `src/data/`, and the other page modules include supporting or inactive modules; they are not the active shell entry point.
- Root `app.js` is legacy and is not loaded by `index.html`.

## Development

```bash
npm install
npm start
```
