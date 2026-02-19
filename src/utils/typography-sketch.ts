import p5 from 'p5'
import seedrandom from 'seedrandom'

export interface SketchParams {
  seed: number
  text: string
  fontSize: number
  letterSpacing: number
  flowIntensity: number
  particleCount: number
  waveAmplitude: number
  waveFrequency: number
  rotationSpeed: number
  colorMode: 'mono' | 'gradient' | 'random'
  animationMode: 'flow' | 'wave' | 'scatter' | 'spiral' | 'harmonics'
  speed: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  originalX: number
  originalY: number
  char: string
  size: number
  angle: number
}

export class TypographySketch {
  private p: p5
  private params: SketchParams
  private rng: any
  private particles: Particle[] = []
  private time: number = 0
  private baseLetters: Array<{
    char: string
    x: number
    y: number
  }> = []

  constructor(containerElement: HTMLElement, params: SketchParams) {
    this.params = params
    this.rng = seedrandom(params.seed.toString())

    this.p = new p5((p: any) => {
      p.setup = () => this.setup(p as p5)
      p.draw = () => this.draw(p as p5)
      p.windowResized = () => this.windowResized(p as p5)
    }, containerElement)
  }

  private setup(p: p5) {
    const container = (this.p as any).canvas?.parentElement
    if (container) {
      const width = container.clientWidth
      const height = container.clientHeight
      p.createCanvas(width, height)
    }

    this.initializeLetters()
    this.generateParticles()
  }

  private initializeLetters() {
    this.baseLetters = []
    const text = this.params.text
    const fontSize = this.params.fontSize
    const centerX = this.p.width / 2
    const centerY = this.p.height / 2

    // Measure text width to center it
    this.p.textSize(fontSize)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    const textWidth = this.p.textWidth(text)

    let x = centerX - textWidth / 2
    const y = centerY

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      this.baseLetters.push({
        char,
        x,
        y,
      })
      x += this.p.textWidth(char) + this.params.letterSpacing
    }
  }

  private generateParticles() {
    this.particles = []

    if (this.baseLetters.length === 0) return

    for (let i = 0; i < this.params.particleCount; i++) {
      const letterIndex = Math.floor(this.rng() * this.baseLetters.length)
      const baseLetter = this.baseLetters[letterIndex]!

      const particle: Particle = {
        x: baseLetter.x + (this.rng() - 0.5) * 20,
        y: baseLetter.y + (this.rng() - 0.5) * 20,
        vx: (this.rng() - 0.5) * 4,
        vy: (this.rng() - 0.5) * 4,
        life: 1,
        originalX: baseLetter.x,
        originalY: baseLetter.y,
        char: baseLetter.char,
        size: this.params.fontSize * (0.5 + this.rng() * 0.5),
        angle: this.rng() * 360,
      }

      this.particles.push(particle)
    }
  }

  private draw(p: p5) {
    p.background(13, 13, 18, 20) // Dark with trail effect
    p.fill(255)
    p.noStroke()

    this.time += this.params.speed * 0.01

    switch (this.params.animationMode) {
      case 'flow':
        this.drawFlow()
        break
      case 'wave':
        this.drawWave()
        break
      case 'scatter':
        this.drawScatter()
        break
      case 'spiral':
        this.drawSpiral()
        break
      case 'harmonics':
        this.drawHarmonics()
        break
    }

    this.updateAndDrawParticles()
  }

  private drawFlow() {
    // Perlin noise-based flow field
    for (const particle of this.particles) {
      const noiseScale = 0.005
      const angle =
        this.p.noise(particle.x * noiseScale, particle.y * noiseScale, this.time * 0.01) *
        this.p.TWO_PI

      const force = this.params.flowIntensity * 0.5
      particle.vx = Math.cos(angle) * force
      particle.vy = Math.sin(angle) * force
    }
  }

  private drawWave() {
    // Sinusoidal wave motion
    for (const particle of this.particles) {
      const offset = this.baseLetters.findIndex(l => l.char === particle.char)
      const wave =
        Math.sin((offset + this.time) * this.params.waveFrequency * 0.1) * this.params.waveAmplitude
      particle.vy = Math.sin(this.time * 0.02 + offset * 0.3) * this.params.flowIntensity
      particle.vx = wave * 0.5
    }
  }

  private drawScatter() {
    // Random scatter with return
    for (const particle of this.particles) {
      const diffX = particle.originalX - particle.x
      const diffY = particle.originalY - particle.y
      const distance = Math.sqrt(diffX * diffX + diffY * diffY)

      if (distance < 100) {
        // Return to origin
        particle.vx += diffX * 0.02
        particle.vy += diffY * 0.02
      } else {
        // Scatter outward
        particle.vx += (this.rng() - 0.5) * this.params.flowIntensity * 0.1
        particle.vy += (this.rng() - 0.5) * this.params.flowIntensity * 0.1
      }

      particle.vx *= 0.95
      particle.vy *= 0.95
    }
  }

  private drawSpiral() {
    // Spiral motion around base positions
    const centerX = this.p.width / 2
    const centerY = this.p.height / 2

    for (const particle of this.particles) {
      const angle = Math.atan2(particle.y - centerY, particle.x - centerX)
      const distance = Math.hypot(particle.x - centerX, particle.y - centerY)

      const spiralSpeed = this.params.flowIntensity * 0.02
      const newAngle = angle + spiralSpeed + distance * 0.001 * this.time * 0.01
      const spiralRadius = 50 + Math.sin(this.time * 0.02) * 30

      particle.vx = (Math.cos(newAngle) * spiralRadius - particle.x) * this.params.speed * 0.01
      particle.vy = (Math.sin(newAngle) * spiralRadius - particle.y) * this.params.speed * 0.01
    }
  }

  private drawHarmonics() {
    // Harmonic oscillation
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]
      const letterIndex = this.baseLetters.findIndex(l => l.char === particle.char)

      const harmonicFreq = letterIndex + 1
      const phase = letterIndex * 0.5
      const amplitude = this.params.waveAmplitude

      const offsetX = Math.cos((this.time + phase) * harmonicFreq * 0.02) * amplitude
      const offsetY = Math.sin((this.time + phase) * harmonicFreq * 0.02) * amplitude * 0.5

      particle.x = particle.originalX + offsetX
      particle.y = particle.originalY + offsetY
    }
  }

  private updateAndDrawParticles() {
    const width = this.p.width
    const height = this.p.height

    for (const particle of this.particles) {
      // Update position
      particle.x += particle.vx * this.params.speed * 0.01
      particle.y += particle.vy * this.params.speed * 0.01

      // Rotation
      particle.angle += this.params.rotationSpeed * 0.1

      // Boundary wrapping
      if (particle.x > width + 50) particle.x = -50
      if (particle.x < -50) particle.x = width + 50
      if (particle.y > height + 50) particle.y = -50
      if (particle.y < -50) particle.y = height + 50

      // Draw particle
      this.drawParticle(particle)
    }
  }

  private drawParticle(particle: Particle) {
    this.p.push()
    this.p.translate(particle.x, particle.y)
    this.p.rotate(this.p.radians(particle.angle))

    // Color based on mode
    switch (this.params.colorMode) {
      case 'mono':
        this.p.fill(255, 200)
        break
      case 'gradient': {
        const hue = (particle.x / this.p.width) * 360
        this.p.colorMode(this.p.HSB)
        this.p.fill(hue, 100, 255, 200)
        this.p.colorMode(this.p.RGB)
        break
      }
      case 'random': {
        const hash = this.hashChar(particle.char)
        this.p.fill((hash * 73) % 256, (hash * 127) % 256, (hash * 191) % 256, 200)
        break
      }
    }

    // Draw character
    this.p.textSize(particle.size * 0.8)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.text(particle.char, 0, 0)

    this.p.pop()
  }

  private hashChar(char: string): number {
    let hash = 0
    for (let i = 0; i < char.length; i++) {
      const code = char.charCodeAt(i)
      hash = (hash << 5) - hash + code
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  public updateParams(newParams: Partial<SketchParams>) {
    this.params = { ...this.params, ...newParams }
    if ('seed' in newParams) {
      this.rng = seedrandom(newParams.seed!.toString())
      this.generateParticles()
    }
    if ('text' in newParams || 'fontSize' in newParams) {
      this.initializeLetters()
      this.generateParticles()
    }
    if ('particleCount' in newParams) {
      this.generateParticles()
    }
  }

  public remove() {
    this.p.remove()
  }

  private windowResized(p: p5) {
    const container = (this.p as any).canvas?.parentElement
    if (container) {
      const width = container.clientWidth
      const height = container.clientHeight
      p.resizeCanvas(width, height)
    }
  }
}
