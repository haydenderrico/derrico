// ============================================
//  Cursor Glow Follow
// ============================================

const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => {
  cursorGlow.classList.remove('active');
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();


// ============================================
//  Particle System — Soft, white/peach sparkles
// ============================================

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const MAX_PARTICLES = 35;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2.5 + 1;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1 - 0.4;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.012;

    // Mostly white with subtle peach/pink tints
    const colors = [
      { r: 255, g: 255, b: 255 },  // white
      { r: 255, g: 255, b: 255 },  // white (weighted)
      { r: 255, g: 250, b: 245 },  // warm white
      { r: 255, g: 240, b: 235 },  // faint peach
      { r: 255, g: 235, b: 240 },  // faint pink
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.speedX *= 0.98;
    this.speedY *= 0.98;
    this.size *= 0.995;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    ctx.shadowColor = `rgba(255, 255, 255, 0.6)`;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.restore();
  }
}

let lastSpawnTime = 0;
const SPAWN_INTERVAL = 100; // slower spawn rate

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSpawnTime > SPAWN_INTERVAL && particles.length < MAX_PARTICLES) {
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 particles
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 16;
      particles.push(new Particle(e.clientX + offsetX, e.clientY + offsetY));
    }
    lastSpawnTime = now;
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();

    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();



