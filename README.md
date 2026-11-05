# Pendragon NPC Tracker

A client-side web tool for tracking NPC combat state in the Pendragon tabletop RPG. All data is stored locally in the browser; no backend is required.

## Features

- Add NPCs manually or from a template; edit, duplicate, and delete (with confirmation)
- Filter the NPC list by name/type and by status
- Track status (Active, Passive, Unconscious, Dead) and position (Mounted, On Foot, On the Ground)
- Hit calculator: applies armour and optional shield, then shows wound size, HP, status/position changes, and knockdown
- Data auto-saves to browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## NPC Stats

- **Total Hit Points**: defaults to SIZ + CON; editing SIZ or CON updates it until it is set manually
- **Damage**: number of d6 (shown as e.g. 5D6); defaults to round((STR + SIZ) / 6) until set manually

## Combat Rules

- **Damage taken** = incoming damage − armour − shield (shield only if used)
- **Wound size**: 0 or less = None; less than CON = Minor; CON or more = Major; Total HP or more = Mortal
- **Knockdown**: incoming damage (before armour/shield) above SIZ = DEX check; above 2× SIZ = automatic knockdown (position becomes On the Ground)
- **Unconscious**: HP below one quarter of Total HP, or a Major/Mortal wound
- **Dead**: HP at 0 or below

## Templates

Templates are JSON files in `src/templates/`.

- To add a template: copy an existing file, then edit its `name` and `npc` values
- To remove a template: delete its file
