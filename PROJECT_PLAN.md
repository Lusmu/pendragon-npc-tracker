# Pendragon NPC Tracker - Project Plan

## Overview
A client-side web tool for tracking NPC states in the Pendragon tabletop RPG. All data is stored locally in the browser with no backend required.

## Core Features

### 1. NPC Management
- **List View**: Display all NPCs in the current scene with key stats
- **NPC Attributes**:
  - Name (free text)
  - Type (free text: Knight, Squire, Peasant, etc.)
  - Total Hit Points (integer, initially SIZ + CON, manually editable)
  - Current Hit Points (integer)
  - Armor Value (integer)
  - Shield Value (integer)
  - Skills (list of text:integer pairs)
  - CON (Constitution, integer)
  - SIZ (Size, integer)
  - DEX (Dexterity, integer)
  - Damage (integer, number of d6 dice; shown as e.g. 5D6, user enters only the number)
  - Glory (integer)
  - Free text notes

### 2. NPC Creation & Management
- **Manual Entry**: Add new NPCs by entering stats directly
- **Duplication**: Clone existing NPCs and modify
- **Templates**: Use predefined NPC templates for quick creation
  - Common types: Knight, Squire, Peasant, Merchant, Noble, Priest, etc.

### 3. Combat Status Tracking
- **Status**: Active, Passive, Unconscious, Dead
- **Position**: Mounted, On Foot, On the Ground
- **Hit Points**: Track and modify current HP

### 4. Damage Resolution System
- **Hit Function**: Enter damage amount and shield usage
- **Damage Calculation**:
  - Deduct armor value from damage
  - Apply shield (if available and chosen)
  - Calculate actual damage taken
  - Determine status changes (Knockdown, Unconscious, Death)
- **Result Display**: Popup showing:
  - Actual damage received
  - Status changes
  - Knockdown possibility
  - Updated NPC state

### 5. Data Persistence
- Auto-save all changes to browser localStorage
- No backend or network required
- Data persists between sessions

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Storage**: Browser localStorage

### Development
- ESLint for code quality
- TypeScript for type safety
- Responsive design for desktop and tablet

## Project Structure

```
src/
├── components/
│   ├── NPCList.tsx          # Main NPC list display
│   ├── NPCCard.tsx          # Individual NPC card
│   ├── NPCForm.tsx          # Add/edit NPC form
│   ├── DamageCalculator.tsx # Hit damage calculation dialog
│   ├── TemplateSelector.tsx # Template selection modal
│   └── StatusBadge.tsx      # Status display component
├── store/
│   └── npcStore.ts          # Zustand store for NPCs
├── types/
│   └── npc.ts              # TypeScript types and interfaces
├── utils/
│   ├── damage.ts           # Damage calculation engine
│   ├── storage.ts          # localStorage helpers
│   ├── templates.ts        # Predefined NPC templates
│   └── knockdown.ts        # Knockdown calculation
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
├── index.css               # Global styles
└── vite-env.d.ts           # Vite environment types
public/
└── index.html              # HTML entry point
```

## Data Model

### NPC Interface
```typescript
interface NPC {
  id: string;
  name: string;
  type: string;
  maxHP: number;
  currentHP: number;
  armorValue: number;
  shieldValue: number;
  skills: Skill[];
  con: number;
  siz: number;
  dex: number;
  damage: number; // number of d6
  glory: number;
  status: 'active' | 'passive' | 'unconscious' | 'dead';
  position: 'mounted' | 'on_foot' | 'on_ground';
  notes: string;
  createdAt: number;
  updatedAt: number;
}

interface Skill {
  name: string;
  value: number;
}
```

## Damage System Rules

1. **Armor Protection**: Armor Value reduces damage taken
2. **Shield Defense**: If shield is available and used, shield value reduces additional damage
3. **Knockdown Check**: If damage received (without accounting for armor or shield) exceeds SIZ, a DEX knockdown check required, if damage more than twice SIZ automatic knockdown
4. **Unconsciousness**: Below one quarter hit points, or receice a Major or Mortal Wound. 
5. **Death**: At 0 or negative Hit Points
6. **Wound Size••: If damage from a single attack after amrour and shield 0 or less, No Wound; less than CON damage, Minor Wound; CON or more damage, Major Wound; Total Hit Points or more damage, Mortal Wound. 

## UI/UX Considerations

- Clean, minimal interface focused on combat tracking
- Color-coded status indicators
- Quick-access damage calculator
- Drag-and-drop NPC ordering (optional)
- Mobile-responsive design
- Dark mode support (optional)

## Development Phases

### Phase 1: Core Setup ✅
- Project initialization
- Type definitions
- Store setup
- Basic component structure

### Phase 2: NPC Management
- Add/edit NPC forms
- List view with filtering
- Template system
- localStorage persistence

### Phase 3: Combat System
- Status/position tracking
- Damage calculator
- Damage result display
- HP management

### Phase 4: Deployment
- Setup Vercel deployment
- Automatic deployment from push to main

### Phase 5: Polish
- UI refinements
- Keyboard shortcuts
- Export/import functionality (optional)
- Additional templates

## Future Enhancements (Out of Scope)
- Character name generator
- Random NPC generator 
- Combat log/history
- Multiplayer support (cloud sync)
- Integrated rule engine

