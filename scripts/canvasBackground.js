const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let W, H;
const particles = [];
const mouse = { x: -9999, y: -9999 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.pow(Math.random(), 1.5) * W;
    this.y = Math.pow(Math.random(), 1.5) * H * 1.4;
    if (this.x > W * 0.75 && this.y > H * 0.75) {
      this.reset();
      return;
    }
    this.size = Math.random() * 14 + 7;
    const shapes = ["plus", "asterisk", "circle", "dot"];
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    this.angle = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.018;
    this.vx = (Math.random() - 0.5) * 0.28;
    this.vy = (Math.random() - 0.5) * 0.28;
    this.scale = 1;
    this.scaleDir = Math.random() > 0.5 ? 0.004 : -0.004;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.rotSpeed;
    this.scale += this.scaleDir;
    if (this.scale > 1.2 || this.scale < 0.8) this.scaleDir *= -1;

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 140;
    if (dist < radius) {
      const force = (radius - dist) / radius;
      const angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * force * 3;
      this.y -= Math.sin(angle) * force * 3;
    }

    if (this.x < -60 || this.y < -60 || this.x > W + 60 || this.y > H + 60)
      this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(this.scale, this.scale);
    ctx.strokeStyle = "#e8a5a5";
    ctx.fillStyle = "#e8a5a5";
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();

    if (this.shape === "plus") {
      ctx.moveTo(-this.size / 2, 0);
      ctx.lineTo(this.size / 2, 0);
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(0, this.size / 2);
      ctx.stroke();
    } else if (this.shape === "asterisk") {
      for (let i = 0; i < 3; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.moveTo(-this.size / 2, 0);
        ctx.lineTo(this.size / 2, 0);
      }
      ctx.stroke();
    } else if (this.shape === "circle") {
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

for (let i = 0; i < 45; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();
