export class Tree {
  constructor(x, y, v0, sprite, sprite_sz) {
    this.x = x
    this.y = y
    this.v = v0
    this.image = sprite
    this.row = 3
    this.t = 0
    this.sprite_sz = sprite_sz
  }

  update(ts) {
    this.x -= this.v
  }

  draw(ctx, frame) {
    ctx.drawImage(
      this.image,
      frame * this.sprite_sz,
      this.row * this.sprite_sz,
      this.sprite_sz,
      this.sprite_sz,
      this.x,
      this.y,
      this.sprite_sz,
      this.sprite_sz
    )
  }
}
