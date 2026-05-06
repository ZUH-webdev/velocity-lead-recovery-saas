# Velocity V2 Design System

## 🎨 Color Tokens

### Primary Palette
- **Indigo Electric:** `#6366f1` — Primary actions, accents, highlights
- **Indigo 600:** `#4f46e5` — Hover state for primary
- **Indigo 700:** `#4338ca` — Active state for primary

### Dark Palette (Backgrounds)
- **Obsidian 950:** `#06080d` — Main background
- **Obsidian 900:** `#0f1419` — Secondary background
- **Slate 950:** `#020617` — Tertiary background
- **Slate 900:** `#0f172a` — Card backgrounds
- **Slate 800:** `#1e293b` — Interactive surfaces
- **Slate 700:** `#334155` — Subtle borders

### Semantic Palette
- **Success Green:** `#10b981` — Confirmed, booked, healthy
- **Warning Yellow:** `#f59e0b` — Follow-up needed, attention
- **Danger Red:** `#ef4444` — Escalation, error, offline
- **Info Blue:** `#3b82f6` — Information, neutral status
- **Neutral Slate:** `#94a3b8` — Disabled, muted text

---

## 📝 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Scale
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| 4xl | 36px | 700 | Page titles |
| 3xl | 30px | 700 | Section headers |
| 2xl | 24px | 600 | Subsection headers |
| xl | 20px | 600 | Card titles |
| lg | 18px | 500 | Emphasis text |
| base | 16px | 400 | Body text |
| sm | 14px | 400 | Labels, secondary |
| xs | 12px | 500 | Micro copy |

---

## 🎯 Component Patterns

### Button Styles

#### Primary CTA
```jsx
className="px-4 py-2.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/50 text-indigo-100 font-medium border border-indigo-500/30"
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

#### Secondary Action
```jsx
className="px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium border border-slate-700/50"
whileHover={{ scale: 1.02 }}
```

#### Danger/Escalate
```jsx
className="px-4 py-2.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
```

### Card Styles

#### Glass Effect Card
```jsx
className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-800/50"
```

#### Hover Interactive Card
```jsx
className="p-5 rounded-xl border border-slate-800/50 backdrop-blur-md bg-slate-900/50 hover:bg-slate-900/80 transition-all group"
whileHover={{ scale: 1.02, y: -4 }}
```

#### Gradient Accent Card
```jsx
className="p-4 rounded-lg bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/30"
```

### Input Styles

#### Search/Text Input
```jsx
className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800"
```

---

## ✨ Animation Patterns

### Entrance Animation (Fade + Slide)
```jsx
motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
```

### Stagger Animation (For lists)
```jsx
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
}
```

### Hover Scale (Interactive elements)
```jsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Slide In (Modals/Drawers)
```jsx
panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { spring: true } },
  exit: { x: '100%', opacity: 0 },
}
```

---

## 🎭 Status Indicators

### Lead Score (0-100)
```
🟢 80+ = High Intent (Green)
🔵 60-79 = Medium Intent (Blue)
🟡 40-59 = Follow-up (Yellow)
🔴 <40 = Low Intent (Red)
```

### Conversation State
```
💭 Greeting = Initial contact
❓ Qualification = Assessing fit
📅 Booking = Arranging appointment
✅ Confirmed = Appointment locked in
```

### Calendar Status
```
🟢 Connected = Syncing properly
🔴 Disconnected = Needs attention
🟡 Syncing = In progress
```

### Appointment Status
```
✅ Scheduled = Confirmed in calendar
⏳ Pending = Awaiting confirmation
❌ Cancelled = No longer valid
```

---

## 📏 Spacing Scale

```
px-0 = 0px       (No padding)
px-1 = 4px       (Extra tight)
px-2 = 8px       (Tight)
px-3 = 12px      (Small)
px-4 = 16px      (Standard)
px-5 = 20px      (Relaxed)
px-6 = 24px      (Generous)
px-8 = 32px      (Very generous)
```

---

## 🔲 Border Radius

```
rounded-none = 0px        (No rounding)
rounded-sm = 2px          (Subtle)
rounded = 4px             (Buttons/inputs)
rounded-lg = 8px          (Cards, modals)
rounded-xl = 12px         (Large sections)
rounded-2xl = 16px        (Extra large)
rounded-full = 9999px     (Circles, badges)
```

---

## 🌊 Backdrop Blur Effects

```
backdrop-blur-sm = 4px blur      (Subtle transparency)
backdrop-blur = 8px blur         (Standard)
backdrop-blur-md = 12px blur     (Strong)
backdrop-blur-lg = 16px blur     (Very strong)
```

**Usage:**
- Modals/Overlays: `backdrop-blur-md`
- Cards: `backdrop-blur-sm`
- Sidebars: `backdrop-blur-lg`

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px    (sm)
Tablet:  640px+     (md: 768px)
Desktop: 1024px+    (lg)
Large:   1280px+    (xl)
```

**Grid Patterns:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## ♿ Accessibility Standards

### Color Contrast (WCAG AA)
- Text on backgrounds: 4.5:1 minimum
- UI elements: 3:1 minimum

### Focus States
```jsx
focus:outline-none focus:ring-2 focus:ring-indigo-500/50
```

### Semantic HTML
- Use `<button>` not `<div onClick>`
- Use `<label>` for form inputs
- Include alt text for images

### Keyboard Navigation
- Tab through interactive elements
- Enter/Space to activate buttons
- Escape to close modals

---

## 🎨 Customization Quick Reference

### Change Primary Color
**File:** `tailwind.config.js`
```javascript
colors: {
  indigo: {
    500: '#YOUR_COLOR',
  }
}
```

### Change Dark Theme
**File:** `src/index.css`
```css
body {
  @apply bg-gradient-to-br from-YOUR_COLOR_1 via-YOUR_COLOR_2 to-YOUR_COLOR_3;
}
```

### Adjust Animation Speed
**File:** Component file
```jsx
transition={{ type: 'spring', stiffness: 300, damping: 30 }}
// Increase stiffness for faster, increase damping for smoother
```

---

## 📊 Data Visualization

### Chart Colors
```javascript
const chartColors = {
  primary: '#6366f1',      // Indigo
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Yellow
  danger: '#ef4444',       // Red
  info: '#3b82f6',         // Blue
  secondary: '#8b5cf6',    // Purple
};
```

### Gradient Fill
```jsx
<defs>
  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.2} />
  </linearGradient>
</defs>
<Bar fill="url(#chartGradient)" />
```

---

## 🖼️ Icon Standards

### Lucide React Icons
All icons use Lucide React (24px default):
```jsx
import { Icon } from 'lucide-react';
<Icon className="w-5 h-5 text-slate-400" />
```

### Sizes
- Micro: `w-3 h-3` (12px)
- Small: `w-4 h-4` (16px)
- Default: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- Extra: `w-8 h-8` (32px)

---

**Last Updated:** May 6, 2026  
**Version:** 1.0.0
