export class Bird {
  constructor(x, y, v0, sprite, sprite_sz) {
    this.x = x
    this.y = y
    this.v = v0
    this.image = sprite
    this.row = 0
    this.t = 0
    this.sprite_sz = sprite_sz
  }

  update(ts) {
    const dt = (ts - this.t) / 500
    const g = 40
    const vt = this.v + g * dt
    this.y += 0.5 * (this.v + vt) * dt
    this.v = vt
    this.t = ts
  }

  flap() {
    this.v -= 50
  }

  collide(other) {
    return Math.hypot(this.x - other.x, this.y - other.y) < 48
  }

  draw(ctx, frame) {
    ctx.drawImage(
      this.image,
      frame * this.sprite_sz,
      0,
      this.sprite_sz,
      this.sprite_sz,
      this.x,
      this.y,
      this.sprite_sz,
      this.sprite_sz
    )
  }
}
