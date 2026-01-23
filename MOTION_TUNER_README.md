# Motion Tuner - Cubic Bezier Animation Tool

A comprehensive web application for creating, visualizing, and exporting custom cubic bezier easing curves, built with the Catalyst design system from Sapukai.

## Features

### 🎨 Interactive Bezier Canvas

- Drag-and-drop control points with visual feedback
- Real-time curve rendering with grid and axis labels
- Hover states with shadows and glow effects
- Coordinate display for precise control
- High-DPI canvas rendering

### 🎛️ Control Panel

Four tab-based sections:

1. **Easing Curve**
   - 13 preset easing functions (Material Design 3, CSS defaults, exponential)
   - Interactive canvas for custom curve creation
   - Live cubic-bezier code display

2. **Duration**
   - Slider control (0-2000ms)
   - 16 preset duration tokens (Short, Medium, Long, Extra Long)
   - Number input for precise values

3. **Transition**
   - Complete CSS transition syntax
   - Common property examples (opacity, transform, background-color, etc.)

4. **Export**
   - 5 export formats: CSS, JSON, GSAP, Design Tokens, M3 Tokens
   - Copy-to-clipboard functionality with fallback
   - Usage tips for each format

### 👁️ Live Preview Panel

Real-time animation previews with your custom easing:

- **Modal Dialog**: Open/close animations
- **Button States**: Hover and focus transitions
- **Accordion**: Expand/collapse with height transitions
- **Notifications**: Slide-in entrance animations
- **Loading States**: Spinner with custom timing
- **Page Transition**: Content fade and slide effects

### 💾 State Persistence

- Automatically saves your settings to localStorage
- Restores previous curve, duration, and active tab on reload

## File Structure

```
src/
├── components/MotionTuner/
│   ├── BezierCanvas.tsx        # Interactive canvas component
│   ├── ControlPanel.tsx        # Control panel with tabs
│   ├── PreviewPanel.tsx        # Preview panel with demos
│   ├── ComponentPreview.tsx    # Animation demonstrations
│   ├── ExportManager.tsx       # Export functionality
│   └── index.ts                # Barrel export
├── context/
│   └── MotionContext.tsx       # Global state management
├── layouts/
│   └── MotionTunerLayout.tsx   # Three-column layout
├── pages/
│   └── MotionTuner.tsx         # Main page component
├── tokens/
│   ├── motion.ts               # Motion token definitions
│   └── motion-theme.css        # CSS motion variables
└── utils/
    ├── bezier.ts               # Bezier curve utilities
    └── clipboard.ts            # Clipboard helpers
```

## Usage

### Running the Application

```bash
npm run dev
```

The Motion Tuner is now the default view when you start the app.

### Using the Motion Tuner

1. **Create Custom Curves**
   - Drag the control points on the canvas to shape your easing curve
   - Or select from 13 preset options

2. **Adjust Duration**
   - Use the slider or number input to set duration (0-2000ms)
   - Or click a preset duration token

3. **Preview Animations**
   - Click component type buttons to see your easing in action
   - All previews update in real-time as you modify settings

4. **Export Your Settings**
   - Go to the Export tab
   - Choose your preferred format (CSS, JSON, GSAP, Design Tokens, M3)
   - Click "Copy" to copy the code to clipboard

### Motion Tokens

The application includes Material Design 3 motion tokens:

**Easing Categories:**

- **Emphasized**: Expressive, personality-driven motion
- **Standard**: Common, balanced motion patterns
- **Legacy**: Traditional CSS timing functions
- **Utility**: Functional, mechanical motion

**Duration Categories:**

- **Short** (50-200ms): Quick micro-interactions
- **Medium** (250-400ms): Most common transitions
- **Long** (450-600ms): Complex animations
- **Extra Long** (700-1000ms): Cinematic effects

## Design System Integration

The Motion Tuner is built entirely with the Catalyst UI design system:

- **Components**: Button, Input, Select, Dialog, Sidebar
- **Colors**: Teal primary (#00686f), Zinc neutrals
- **Typography**: Nunito (headings), Martian Mono (navigation), Menlo (code)
- **Spacing**: Consistent 4/8/12/16/24px rhythm
- **Border Radius**: 6/8/12px rounded corners

## CSS Custom Properties

Motion tokens are available as CSS custom properties:

```css
/* Easing */
var(--motion-easing-emphasized)
var(--motion-easing-standard)
var(--motion-easing-linear)

/* Duration */
var(--motion-duration-short-1)
var(--motion-duration-medium-2)
var(--motion-duration-long-3)
```

## Export Formats

### 1. CSS

Standard CSS custom properties and transition syntax.

### 2. JSON

Structured data format with control point coordinates and metadata.

### 3. GSAP

GreenSock Animation Platform code snippets with ease registration.

### 4. Design Tokens

Style Dictionary compatible format following W3C specification.

### 5. M3 Tokens

Material Design 3 motion token format with md.sys.motion prefix.

## Technical Details

### State Management

- React Context API with useReducer
- Persistent state in localStorage
- Type-safe actions and state updates

### Canvas Rendering

- Device pixel ratio support for high-DPI displays
- 60fps smooth animations with requestAnimationFrame
- Bezier curve mathematics for accurate rendering

### Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management in modals
- Screen reader friendly

### Browser Compatibility

- Modern Clipboard API with execCommand fallback
- Canvas API support detection
- Touch event support for mobile devices

## Future Enhancements

Potential features for future development:

- [ ] Animation timeline editor
- [ ] Curve comparison tool (side-by-side)
- [ ] Preset library with community curves
- [ ] Import from CSS/JSON
- [ ] Animation recording and playback
- [ ] Mobile-responsive layout
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Undo/redo functionality
- [ ] Save and load projects

## Credits

Built with:

- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS v4
- Radix UI primitives
- Heroicons
- Catalyst Design System (Sapukai)

Following Material Design 3 motion principles.
