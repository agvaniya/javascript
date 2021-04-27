class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 1 + Math.random() * 3;
    this.color = color || new Color(0, 0, 255, 1);
    const theta = Math.random() * 2 * Math.PI;
    const vmult = 4 + Math.random() * 8;
    this.velocity = { x: vmult * Math.cos(theta), y: vmult * Math.sin(theta) };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.x *= 0.97;
    this.velocity.y *= 0.97;
    this.color.a -= 0.01;
  }

  draw(ctx) {
    ctx.fillStyle = this.color.rgba();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Projectile {
  constructor(x, y, radius, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = new Color(255, 255, 255);
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  draw(ctx) {
    ctx.fillStyle = this.color.rgba();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
