class Player {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.color = new Color(255, 255, 255);
    this.outline = new Color(0, 0, 255, 0.7);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color.rgba();
    ctx.strokeStyle = this.outline.rgba();
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

class Enemy {
  constructor(x, y, radius, velocity, borders) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.org_radius = radius;
    this.color = new Color(
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    );
    this.velocity = velocity;
    this.destructibe = false;
    this.borders = borders;
    this.shrink = 0;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.shrink > 0) {
      this.radius -= (this.org_radius * 0.4) / 5;
      this.shrink -= 1;
    }
    if (
      this.x > 0 &&
      this.y > 0 &&
      this.x < this.borders.width &&
      this.y < this.borders.height
    )
      this.destructibe = true;
  }

  collide(e) {
    const d = Math.hypot(e.x - this.x, e.y - this.y);
    const res = d - e.radius - this.radius;
    return res < 1;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color.rgba();
    // ctx.strokeStyle = this.outline.rgba();
    // ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.stroke();
    ctx.fill();
  }
}
