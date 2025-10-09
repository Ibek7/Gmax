// Particle system for creative effects
export class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 4
    this.vy = (Math.random() - 0.5) * 4
    this.life = 255
    this.color = color || '#6366f1'
    this.size = Math.random() * 3 + 1
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.life -= 3
    this.vy += 0.1 // gravity
  }
  
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.life / 255
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  
  isDead() {
    return this.life <= 0
  }
}

// Confetti effect generator
export const createConfetti = (element, colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const rect = element.getBoundingClientRect()
  
  canvas.width = rect.width
  canvas.height = rect.height
  canvas.style.position = 'absolute'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '1000'
  
  element.style.position = 'relative'
  element.appendChild(canvas)
  
  const particles = []
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(
      canvas.width / 2,
      canvas.height / 2,
      colors[Math.floor(Math.random() * colors.length)]
    ))
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update()
      particles[i].draw(ctx)
      
      if (particles[i].isDead()) {
        particles.splice(i, 1)
      }
    }
    
    if (particles.length > 0) {
      requestAnimationFrame(animate)
    } else {
      element.removeChild(canvas)
    }
  }
  
  animate()
}

// Smooth scroll to element
export const smoothScrollTo = (element, duration = 800) => {
  const targetPosition = element.offsetTop
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime = null
  
  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const run = ease(timeElapsed, startPosition, distance, duration)
    window.scrollTo(0, run)
    if (timeElapsed < duration) requestAnimationFrame(animation)
  }
  
  const ease = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
  
  requestAnimationFrame(animation)
}

// Text typing animation
export const typeWriter = (element, text, speed = 50) => {
  element.innerHTML = ''
  let i = 0
  
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
    } else {
      clearInterval(timer)
    }
  }, speed)
  
  return timer
}

// Color utils for theme generation
export const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return [h * 360, s * 100, l * 100]
}

export const hslToHex = (h, s, l) => {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}