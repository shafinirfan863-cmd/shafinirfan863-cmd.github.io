/* ==========================================================================
   HOMEWORK 8: INTERACTIVE COCKPIT LOGIC & ANIMATIONS (JavaScript)
   - Beginner friendly: clearly organized and commented.
   - Requirement 6: Animations (Dynamic canvas particles & telemetry reacts).
   ========================================================================== */

// 1. Dynamic Cyber Particles Background
const canvas = document.getElementById('cyber-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 45;

// Color palette matching the unconventional theme:
const colors = ['#ff2a6d', '#05d9e8', '#ffb703', '#00f59b'];

// Resize canvas dynamically to match window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle Class to create animated floating cyber nodes
class CyberParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.6 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen edges
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new CyberParticle());
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw connecting laser filaments between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 110) {
        ctx.save();
        ctx.strokeStyle = '#05d9e8';
        ctx.globalAlpha = (1 - distance / 110) * 0.15;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Update and draw each particle
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================================================
// 2. Cockpit Web Audio Synthesizer (Optional sound effects without audio files!)
// ==========================================================================
let audioContext = null;
let soundEnabled = false;

const audioToggleBtn = document.getElementById('audio-toggle-btn');

if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    if (!audioContext) {
      // Create native web audio context on user gesture
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
      audioToggleBtn.innerHTML = '🔊 SFX: ACTIVE';
      playCyberBeep(620, 0.08);
    } else {
      audioToggleBtn.innerHTML = '🔈 SFX: MUTED';
    }
  });
}

// Play a futuristic procedural synthesizer tone
function playCyberBeep(frequency = 440, duration = 0.06) {
  if (!soundEnabled || !audioContext) return;

  try {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Smooth volume fade
    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

// Add subtle audio feedback when hovering over interactive cockpit modules
document.querySelectorAll('.console-module-pod, .warp-portal-card, .cockpit-eject-beacon, .nexus-jump-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    playCyberBeep(520, 0.04);
  });
  el.addEventListener('click', () => {
    playCyberBeep(880, 0.1);
  });
});

// ==========================================================================
// 3. Live Telemetry Randomizer (Gives the cockpit a living feeling)
// ==========================================================================
const livePing = document.getElementById('telemetry-ping');
if (livePing) {
  setInterval(() => {
    const randomMs = Math.floor(Math.random() * 12) + 18;
    livePing.textContent = `${randomMs}ms`;
  }, 2500);
}
