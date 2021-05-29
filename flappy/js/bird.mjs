export class Bird {
  constructor(x, y, v0, sprite, sprite_sz) {
    this.x = x
    this.y = y
    this.v = v0
    this.image = sprite
    this.row = 0
    this.t = 0
    this.sprite_sz = sprite_sz
    this.idle_frames = [0,0,3,3]
    this.flap_frames = [0,1,2,3]
    this.ani_frames = this.idle_frames
    this.flaps = 0
  }

  update(ts) {
    const dt = (ts - this.t) / 330
    const g = 40
    const vt = this.v + g * dt
    this.y += 0.5 * (this.v + vt) * dt
    this.v = vt
    this.t = ts
    
  }

  flap() {
    this.v -= 70
    if (this.v < -90) this.v = -90
    this.ani_frames = this.flap_frames

  }

  collide(other) {
    return Math.hypot(this.x - other.x, this.y - other.y) < 48
  }

  draw(ctx, frame) {
    const ani_frame = this.ani_frames[frame]
    if (this.ani_frames === this.flap_frames) {
      if(this.flaps >3) {
        this.flaps = 0
        this.ani_frames = this.idle_frames
      }else this.flaps++
    }
    ctx.drawImage(
      this.image,
      ani_frame * this.sprite_sz,
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
