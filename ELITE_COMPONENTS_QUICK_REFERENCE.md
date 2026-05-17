# 🚀 Elite Dashboard Components - Quick Reference

## Import Statements

```jsx
// New Elite Components
import StatsGrid from './components/StatsGrid';
import PremiumFunnelChart from './components/PremiumFunnelChart';
import StatCard from './components/StatCard'; // Individual card

// Utilities
import { motion } from 'framer-motion';
import { CountUp } from 'react-countup';
```

---

## Component Usage

### StatsGrid - Elite KPI Grid

```jsx
<StatsGrid 
  metrics={{
    revenueRecovered: 125680,
    recoveryRate: 73.2,
    leadsRecovered: 1240,
    activeConversations: 48,
    appointmentsBooked: 342,
    conversionRate: 68.5,
    aiHandled: 892,
    systemUptime: 99.8,
  }}
  isLoading={false}
/>
```

**Props:**
- `metrics` (object): KPI values
- `isLoading` (boolean): Show skeleton loaders

**Default Metrics (if not provided):**
```javascript
{
  revenueRecovered: 125680,
  recoveryRate: 73.2,
  leadsRecovered: 1240,
  activeConversations: 48,
  appointmentsBooked: 342,
  conversionRate: 68.5,
  aiHandled: 892,
  systemUptime: 99.8,
}
```

---

### PremiumFunnelChart - Curved Stream Funnel

```jsx
<PremiumFunnelChart metrics={metrics} />
```

**Props:**
- `metrics` (object): Optional metrics object (for future enhancements)

**Features:**
- Automatic funnel data generation (5 stages)
- Real-time conversion rate calculation
- System pulse with ripple effect
- 3 summary KPI cards below chart

---

### StatCard - Individual Elite Card

```jsx
<StatCard
  icon={DollarSign}
  label="Revenue Recovered"
  value={125680}
  prefix="$"
  suffix=""
  color="indigo"
  isLoading={false}
  animateValue={true}
  endValue={125680}
  index={0}
/>
```

**Props:**
- `icon` (React.Component): Lucide icon
- `label` (string): Card title
- `value` (number|string): Display value
- `prefix` (string): Before value (e.g., "$")
- `suffix` (string): After value (e.g., "%")
- `color` (string): Theme color (indigo|purple|emerald|amber|blue)
- `isLoading` (boolean): Show skeleton
- `animateValue` (boolean): Use CountUp animation
- `endValue` (number): CountUp target value
- `index` (number): For stagger animation

**Color Options:**
```javascript
colors = [
  'indigo'   // Default, blue-toned
  'purple'   // Violet blend
  'emerald'  // Green/teal
  'amber'    // Orange/yellow
  'blue'     // Cyan blend
]
```

---

## Tailwind Utilities

### Neumorphic Classes

```jsx
// Carved inset design (for backgrounds)
<div className="neu-carved p-6">
  Content carved into background
</div>

// Elevated outset design (for cards)
<div className="neu-elevated p-6">
  Lifted element
</div>

// Soft pressed (for icon trays)
<div className="neu-pressed p-3">
  Icon here
</div>

// Glassmorphism (for overlays)
<div className="glassmorphism rounded-lg p-4">
  Frosted glass effect
</div>
```

### Box Shadows

```jsx
// Soft neumorphic shadow
<div className="shadow-neu-soft">

// Inset neumorphic shadow
<div className="shadow-neu-inset">

// Pressed appearance
<div className="shadow-neu-pressed">

// Elite glow effect
<div className="shadow-elite-glow">
```

### Colors

```jsx
// Vivid Violet accent
<div className="text-[#7c3aed]">
<div className="bg-[#7c3aed]">

// Neumorphic colors
<div className="text-slate-600">
<div className="bg-[#e0e5ec]">  // Background

// Gradient text
<span className="bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
```

### Typography

```jsx
// Plus Jakarta Sans geometric font
<h1 className="font-jakarta text-4xl font-black">
  Elite Heading

<p className="font-jakarta font-bold text-lg">
  Bold text
```

---

## Framer Motion Patterns

### Staggered Container

```jsx
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {/* Child items animate sequentially */}
</motion.div>
```

### Spring Transition

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 120,   // Higher = snappier
    damping: 20,      // Higher = less bouncy
  }}
>
</motion.div>
```

### Hover Effects

```jsx
<motion.div
  whileHover={{ 
    scale: 1.05,
    y: -4,
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
</motion.div>
```

---

## React CountUp Integration

```jsx
import { CountUp } from 'react-countup';

// Basic counter
<CountUp
  end={125680}
  duration={2.5}
  separator=","
/>

// With decimals
<CountUp
  end={73.2}
  duration={2}
  decimals={1}
  suffix="%"
/>

// With prefix
<CountUp
  end={125680}
  prefix="$"
  separator=","
/>
```

---

## Lucide Icons Used

```jsx
import {
  DollarSign,      // Revenue
  TrendingUp,      // Growth trends
  Users,           // Lead count
  Zap,             // System pulse
  Phone,           // Conversations
  Calendar,        // Appointments
  Activity,        // Metrics
  Brain,           // AI
  Filter,          // Filters
  Search,          // Search
  Download,        // Export
} from 'lucide-react';
```

---

## Animation Keyframes

### Ripple Effect

```css
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
```

### Pulse Soft

```css
@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## Common Patterns

### Loading State

```jsx
<StatsGrid
  metrics={metrics}
  isLoading={metricsLoading}
/>
```

Shows skeleton loaders while data loads.

### Dynamic Metrics

```jsx
const [metrics, setMetrics] = useState(null);

useEffect(() => {
  // Fetch metrics from API
  setMetrics(data);
}, []);

<StatsGrid metrics={metrics} />
```

### Error Handling

```jsx
try {
  <StatsGrid metrics={metrics} />
} catch (error) {
  console.error('Dashboard error:', error);
  // Show fallback UI
}
```

---

## CSS Variables

Available in `index.css`:

```css
:root {
  --neu-bg: #e0e5ec;                              /* Background */
  --neu-dark: #bec3cf;                            /* Dark shadow */
  --neu-light: #ffffff;                           /* Light shadow */
  --neu-text-dark: #3d4468;                       /* Primary text */
  --neu-text-light: #9499b7;                      /* Secondary text */
  --neu-text-muted: #6c7293;                      /* Muted text */
  --neu-shadow: rgb(163, 177, 198);               /* Shadow color */
  --neu-highlight: rgb(255, 255, 255);            /* Highlight */
  --vivid-violet: #7c3aed;                        /* Primary accent */
  --neu-success: #00c896;                         /* Success color */
  --neu-error: #ff3b5c;                           /* Error color */
}
```

Use in CSS:
```css
color: var(--vivid-violet);
box-shadow: 4px 4px 8px var(--neu-shadow);
```

---

## Performance Tips

1. **Memoize metrics** - Use useMemo to avoid unnecessary recalculations
2. **Lazy load charts** - Use React.lazy for PremiumFunnelChart
3. **Optimize animations** - Use transform and opacity only
4. **Debounce updates** - For real-time metric updates
5. **Code split** - Separate component bundles

Example:
```jsx
const PremiumFunnelChart = React.lazy(
  () => import('./PremiumFunnelChart')
);

<Suspense fallback={<div>Loading...</div>}>
  <PremiumFunnelChart metrics={metrics} />
</Suspense>
```

---

## Responsive Examples

```jsx
// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive display
<div className="hidden md:block">Show on medium+</div>
```

---

## Browser DevTools Debugging

### Inspect Animations
1. Open DevTools → Elements
2. Click element with animation
3. Styles tab → Look for @keyframes

### Check Colors
- Use color picker on any element
- Hover states in Styles tab
- Box model for shadows

### Performance Profiling
1. DevTools → Performance
2. Record interaction
3. Analyze frame rate (aim 60fps)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Font not loading | Check `index.html` font import |
| Shadows not showing | Ensure `tailwind.config.js` has box-shadow |
| Animations stuttering | Check GPU acceleration on container |
| CountUp not animating | Verify `react-countup` is installed |
| Glassmorphism not working | Check browser supports backdrop-filter |

---

## File Locations

```
frontend/
├── src/
│   ├── components/
│   │   ├── StatsGrid.jsx          ← NEW
│   │   ├── PremiumFunnelChart.jsx ← NEW
│   │   ├── StatCard.jsx           ← ENHANCED
│   │   └── Dashboard.jsx          ← UPDATED
│   └── index.css                  ← ENHANCED
├── tailwind.config.js             ← UPDATED
├── index.html                     ← (fonts already added)
└── ELITE_DASHBOARD_GUIDE.md       ← NEW
```

---

**Last Updated**: May 11, 2024
**Version**: 2.0 Elite
**Status**: Production Ready ✨
