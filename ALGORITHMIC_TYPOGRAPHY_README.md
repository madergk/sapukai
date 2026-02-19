# Algorithmic Typography - Interactive Kinetic Text Animation Tool

A web-based tool for creating algorithmic typography kinetic experiments with interactive parameter exploration and deterministic seeded randomness. Built with React, p5.js, and seedrandom.

## Overview

**Algorithmic Typography** enables creative experimentation with generative text animation. Using flow fields, wave patterns, particle systems, and harmonic oscillations, you can create stunning kinetic typography that responds to interactive parameters.

All randomness is **seeded and deterministic**, meaning the same seed always produces the same animation. This makes it easy to reproduce and share specific motion configurations.

## Features

### Animation Modes

1. **Flow Field**
   - Perlin noise-based particle flow
   - Creates smooth, liquid-like motion
   - Particles follow invisible forces in 2D space

2. **Wave**
   - Sinusoidal wave motion
   - Characters oscillate in harmonic patterns
   - Frequency and amplitude are adjustable

3. **Scatter**
   - Particles disperse outward from their base positions
   - Automatically return toward original positions
   - Creates explosive, dynamic effects

4. **Spiral**
   - Orbital spiral motion around screen center
   - Particles follow curved paths
   - Responsive to velocity and rotation parameters

5. **Harmonics**
   - Mathematical harmonic oscillation
   - Different characters oscillate at different frequencies
   - Creates complex, rhythmic patterns

### Color Modes

- **Monochrome**: Classic white text on dark background
- **Gradient**: Color based on horizontal position (rainbow effect)
- **Random**: Colors determined by character hash (reproducible per character)

### Interactive Parameters

- **Text**: Input any text to animate
- **Seed**: Control randomness (0-9999). Same seed = same animation
- **Font Size**: 20-120px
- **Letter Spacing**: 0-50px
- **Particle Count**: 50-1000 particles per animation frame
- **Flow Intensity**: 0-5 (strength of motion forces)
- **Wave Amplitude**: 0-50px (height of wave motion)
- **Wave Frequency**: 0.1-3 (oscillations per time unit)
- **Rotation Speed**: 0-5 (character rotation velocity)
- **Animation Speed**: 0.1-3x (time scaling)

### Preset Configurations

Quick-load animation styles:

- **Flowing Water**: Smooth flow field with gradient colors
- **Wave Pulse**: Synchronized wave motion
- **Chaotic Dance**: High-intensity scatter with rotation
- **Spiral Vortex**: Orbital motion with teal gradients
- **Harmonic Oscillation**: Gentle harmonic waves

## Technical Architecture

### Core Components

#### `TypographySketch` (`src/utils/typography-sketch.ts`)

The main p5.js sketch engine handling:

- Deterministic particle generation with seedrandom
- Animation loop with five motion algorithms
- Real-time parameter updates without recreating sketch
- Boundary wrapping and coordinate transformations

#### `P5Canvas` (`src/components/AlgorithmicTypography/P5Canvas.tsx`)

React wrapper for p5.js:

- Manages sketch lifecycle (creation, updates, cleanup)
- Handles canvas resizing
- Syncs parameter changes with sketch

#### `ControlPanel` (`src/components/AlgorithmicTypography/ControlPanel.tsx`)

Interactive parameter controls:

- Sliders for numeric values
- Dropdowns for mode selection
- Text input for animation content
- Random seed generator button

#### `AlgorithmicTypography` (`src/pages/AlgorithmicTypography.tsx`)

Main page component:

- State management for all parameters
- Preset system with predefined animations
- Layout and navigation

### Algorithms

#### Flow Field (Perlin Noise)

```
angle = noise(x * scale, y * scale, time) * TWO_PI
vx = cos(angle) * force
vy = sin(angle) * force
```

#### Wave Motion

```
wave = sin((offset + time) * frequency) * amplitude
particle.vx = wave * intensity
particle.vy = sin(time + offset) * intensity
```

#### Scatter with Attraction

```
if distance_to_origin < threshold:
  apply_return_force()
else:
  apply_scatter_force()
```

#### Spiral Orbit

```
angle = atan2(y - center.y, x - center.x)
distance = hypot(x - center.x, y - center.y)
newAngle = angle + spiralSpeed + distance * time
```

#### Harmonic Oscillation

```
offsetX = cos((time + phase) * frequency) * amplitude
offsetY = sin((time + phase) * frequency) * amplitude * 0.5
position = original + offset
```

## Usage

### Basic Setup

```bash
npm install
npm run dev
```

Navigate to `/algorithmic-typography` in your browser.

### Creating Animations

1. **Change the Text**: Edit the text input at the top of the control panel
2. **Select Animation Mode**: Choose from 5 different motion algorithms
3. **Adjust Parameters**: Use sliders to fine-tune the motion
4. **Apply Presets**: Click preset buttons for quick inspiration
5. **Randomize Seed**: Click "Random" to generate new motion variations

### Reproducible Animations

The seed system enables perfect reproducibility:

```javascript
// Seed 42 always produces the same animation
// Share seed values to reproduce effects exactly
```

### Exporting Animations

Currently, animations render in the browser canvas. To capture:

- Use browser screenshot tool (Cmd+Shift+4 on macOS)
- Use screen recording software for video export
- Use canvas API for programmatic capture

## Performance Considerations

- **Particle Count**: Higher counts (500+) may reduce frame rate on older devices
- **Canvas Size**: Animations scale to container; full-screen = more particles
- **Animation Speed**: Higher speeds increase computational load
- **Color Mode**: Gradient mode has minimal performance impact

### Optimization Tips

- Start with 300-400 particles for smooth motion
- Use `speed: 0.8-1.2` for typical animations
- Reduce particle count on mobile devices
- Use monochrome mode for better performance

## Dependencies

- **p5.js**: Graphics rendering and sketch framework
- **seedrandom**: Deterministic PRNG for reproducible randomness
- **React**: Component framework and state management
- **Tailwind CSS**: Styling

## File Structure

```
src/
├── utils/
│   └── typography-sketch.ts        # p5.js sketch logic
├── components/
│   └── AlgorithmicTypography/
│       ├── P5Canvas.tsx             # React p5.js wrapper
│       ├── ControlPanel.tsx         # Parameter controls
│       └── index.ts                 # Component exports
└── pages/
    └── AlgorithmicTypography.tsx    # Main page component
```

## Design Principles

1. **Algorithmic Determinism**: Seeded randomness enables reproducible art
2. **Interactive Exploration**: Real-time parameter feedback
3. **Accessibility**: Keyboard and mouse controls
4. **Performance**: Efficient particle rendering with p5.js
5. **Modularity**: Reusable sketch classes and components

## Future Enhancements

Potential features for expansion:

- Export animations as PNG/GIF sequences
- Download parameter configurations as JSON
- Community animation library and sharing
- Advanced particle physics (gravity, collision)
- Custom bezier curves for motion paths
- Keyboard input for real-time parameter control
- Multiple text layers and blending modes
- Audio-reactive animations

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

p5.js requires WebGL support for optimal performance.

## Resources

- [p5.js Documentation](https://p5js.org/reference/)
- [seedrandom](https://github.com/davidbau/seedrandom)
- [Perlin Noise](https://en.wikipedia.org/wiki/Perlin_noise)
- [Harmonic Motion](https://en.wikipedia.org/wiki/Harmonic_motion)

## License

Part of the Sapukai Design System. See LICENSE file in project root.
