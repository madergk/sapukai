# Algorithmic Typography - Quick Start Guide

Welcome to the Algorithmic Typography tool! This guide will get you creating kinetic text animations in minutes.

## What You'll Build

Interactive, animated text that responds to parameters in real-time. Change seeds, animation modes, colors, and motion parameters to create stunning generative typography.

## Getting Started

### 1. Access the Tool

After starting the dev server:

```bash
npm run dev
```

Navigate to: `http://localhost:5173/algorithmic-typography`

Or click "Open Algorithmic Typography" from the home page.

### 2. Basic Animation (2 minutes)

1. **Observe the default animation**
   - Text "KINETIC" animates with flowing water effect
   - Particles move smoothly using Perlin noise

2. **Change the text**
   - Edit the "Text" field in the control panel
   - Try: `HELLO`, `MOTION`, `FLOW`

3. **Try a preset**
   - Click "Wave Pulse" button
   - Watch the animation mode switch to waves
   - Text oscillates in harmonic patterns

### 3. Explore Animation Modes (5 minutes)

Each dropdown controls how particles move:

| Mode           | Best For               | Try This                      |
| -------------- | ---------------------- | ----------------------------- |
| **Flow Field** | Smooth, organic motion | Default - observe liquid flow |
| **Wave**       | Rhythmic oscillation   | Click "Wave Pulse" preset     |
| **Scatter**    | Explosive effects      | Click "Chaotic Dance"         |
| **Spiral**     | Orbital patterns       | Click "Spiral Vortex"         |
| **Harmonics**  | Complex patterns       | Click "Harmonic Oscillation"  |

### 4. Adjust Parameters (5 minutes)

Move sliders to see real-time changes:

**Recommended Starting Values:**

| Parameter       | Value   | Effect              |
| --------------- | ------- | ------------------- |
| Font Size       | 80px    | Large, visible text |
| Particle Count  | 300-400 | Smooth animation    |
| Flow Intensity  | 2-3     | Noticeable motion   |
| Animation Speed | 1x      | Normal timing       |
| Wave Amplitude  | 20-30px | Visible waves       |
| Wave Frequency  | 1.5-2   | Natural oscillation |

### 5. Master the Seed System (3 minutes)

The **seed** parameter controls randomness:

```
Seed 42 → Same animation every time
Seed 99 → Different animation
Random Button → New seed each click
```

**Seed Uses:**

- Same seed = reproducible animations (great for design systems)
- Share seed numbers with colleagues
- Use seeds to version different animation styles

**Try this:**

1. Set seed to `42`
2. Note the animation
3. Close and reopen the tool
4. Set seed to `42` again
5. See the exact same animation reproduce!

### 6. Combine for Unique Effects (10 minutes)

Mix multiple parameters:

#### Example 1: Energetic Text

```
Mode: Scatter
Particle Count: 500
Flow Intensity: 3
Speed: 1.5
Color Mode: Random
Text: ENERGY
```

#### Example 2: Calm Waves

```
Mode: Wave
Wave Amplitude: 40
Wave Frequency: 0.8
Speed: 0.7
Color Mode: Gradient
Text: PEACE
```

#### Example 3: Hypnotic Spiral

```
Mode: Spiral
Flow Intensity: 2.5
Rotation Speed: 3
Speed: 1
Color Mode: Gradient
Text: VORTEX
```

## Pro Tips

### Performance

- On slower devices, reduce Particle Count to 200-300
- Lower Animation Speed slightly if frame rate drops
- Monochrome color mode is fastest

### Visual Polish

- Use **Gradient** color mode for professional look
- Adjust **Letter Spacing** for composition
- Keep **Font Size** 60-100px for readability

### Reproducibility

- Always note your **Seed** value
- Export parameter screenshots
- Share seed numbers for exact reproduction

### Experimentation

- Click **"Random"** button to get random seeds
- Try each preset as a starting point
- Modify one parameter at a time to understand effects

## What Each Section Does

### Text Input

- Enter any text to animate (30+ characters work best)
- Changes regenerate particles immediately

### Seed Controls

- **Number**: Direct seed input (0-9999)
- **Random Button**: Generate random seed
- Higher seeds = different randomness patterns

### Animation Mode Dropdown

- **Flow Field**: Uses Perlin noise (organic, smooth)
- **Wave**: Sinusoidal oscillation (rhythmic)
- **Scatter**: Particles disperse then return (explosive)
- **Spiral**: Orbital motion (geometric)
- **Harmonics**: Different frequencies per character (complex)

### Color Mode Dropdown

- **Monochrome**: White text (clean, classic)
- **Gradient**: Rainbow based on X position (vibrant)
- **Random**: Hash-based per character (unique, still seeded)

### Parameter Sliders

**Particle System:**

- Font Size: Overall text scale
- Letter Spacing: Gap between characters
- Particle Count: Number of moving elements

**Motion Parameters:**

- Flow Intensity: Strength of motion forces
- Wave Amplitude: Height of wave motion
- Wave Frequency: Speed of oscillation
- Rotation Speed: Character spinning
- Animation Speed: Overall timing (0.5x = slow, 1.5x = fast)

### Preset Buttons

Click any to instantly apply themed settings:

- **Flowing Water**: Smooth, liquid aesthetic
- **Wave Pulse**: Synchronized waves
- **Chaotic Dance**: High-energy scatter
- **Spiral Vortex**: Orbital beauty
- **Harmonic Oscillation**: Gentle mathematics

## Troubleshooting

**Animation is slow:**

- Reduce Particle Count
- Lower Animation Speed
- Disable gradient color mode

**Text is hard to read:**

- Increase Font Size
- Increase Letter Spacing
- Switch to Monochrome color mode

**Animation doesn't respond to changes:**

- Seed changes need regeneration (happens auto)
- Parameter changes apply in real-time
- Try "Reset to Defaults" if stuck

**Canvas not displaying:**

- Refresh the page
- Check browser console for errors
- Ensure p5.js loaded (check network tab)

## Next Steps

### Create a Design System Animation

```javascript
// Use a specific seed for consistency
seed: 2024
mode: 'flow'
colors: 'gradient'
```

### Share Your Creations

```
Text: "YOUR TEXT"
Seed: 1234
Mode: Wave
Colors: Gradient
```

### Learn More

- Read `ALGORITHMIC_TYPOGRAPHY_README.md` for technical details
- Explore p5.js docs: https://p5js.org
- Learn about Perlin noise for organic motion

## Quick Reference

**Most Used Controls:**

1. Text Input - Change what animates
2. Animation Mode - Change how it moves
3. Seed - Reproduce animations
4. Particle Count - Adjust density
5. Flow Intensity - Adjust motion strength

**Best Starting Point:**

- Start with "Flowing Water" preset
- Change the text
- Adjust Font Size
- Try different seeds

## Enjoy Creating!

The tool is designed for exploration. There's no "right" way - just experiment, play with sliders, and create animations that feel right to you. Use seeds to save your favorites!

---

Have questions? Check `ALGORITHMIC_TYPOGRAPHY_README.md` for detailed documentation.
