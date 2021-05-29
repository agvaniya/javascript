import { Bird } from './bird.mjs'
import { Tree } from './tree.mjs'
import { Rock } from './rock.mjs'
import { Coin } from './coin.mjs'

const canvas = document.querySelector('#canvas')
canvas.width = 1024
canvas.height = 614

const score_lbl = document.querySelector('#score')

const ctx = canvas.getContext('2d')
const image = new Image()
image.src = 'res/flappy.png'
let frame = 0
const SPRITE_SZ = 64
const EARTH = canvas.height - 100
let game_over = false
let score = 0

const bird = new Bird(70, canvas.height / 2, 0, image, SPRITE_SZ)

const trees = []
for (let i = 0; i < 20; i++) {
  const plane = Math.random() * 60
  trees.push(
    new Tree(
      Math.random() * 700 + 700,
      plane + 480,
      Math.floor(plane / 20) + 2,
      image,
      SPRITE_SZ
    )
  )
}

let coin = new Coin(
  Math.random() * 700 + 1024,
  Math.random() * 500,
  Math.random() * 5 + 1,
  image,
  SPRITE_SZ
)

const rocks = []

const spawnInterval = setInterval(() => {
  rocks.push(
    new Rock(
      Math.random() * 700 + 1024,
      Math.random() * 500,
      Math.random() * 5 + 1,
      image,
      SPRITE_SZ
    )
  )
}, 1000)

function update(ts) {
  coin.update(ts)
  if (bird.collide(coin)) {
    coin = new Coin(
      Math.random() * 700 + 1024,
      Math.random() * 500,
      Math.random() * 3 + 1,
      image,
      SPRITE_SZ
    )
    score += 100
  } else if (coin.x + SPRITE_SZ < 0) {
    coin = new Coin(
      Math.random() * 700 + 1024,
      Math.random() * 500,
      Math.random() * 3 + 1,
      image,
      SPRITE_SZ
    )
  }
  bird.update(ts)
  if (bird.y < 0) {
    bird.y = 0
    bird.v = 1
  }
  if (bird.y > EARTH) {
    bird.y = EARTH
    bird.v = -20
    game_over = true
  }
  rocks.forEach((rock, ix) => {
    rock.update(ts)
    if (bird.collide(rock)){
      game_over = true   
    } else if (rock.x + SPRITE_SZ < 0) {
      setTimeout(() => {
        rocks.splice(ix, 1)
        score += 1
      })
    }
  })

  trees.forEach((tree, ix) => {
    tree.update(ts)
    if (tree.x + SPRITE_SZ < 0) {
      setTimeout(() => {
        trees.splice(ix, 1)
        const plane = Math.random() * 60
        trees.push(
          new Tree(
            Math.random() * 700 + 700,
            plane + 480,
            Math.floor(plane / 20) + 2,
            image,
            SPRITE_SZ
          )
        )
      })
    }
  })
}

document.addEventListener('pointerup', (ev) => {
  bird.flap()
})

function drawGameOver() {
  clearInterval(spawnInterval)
  ctx.fillStyle = 'rgb(85,120,225)'
  ctx.fillRect(0, 0, canvas.width, EARTH)
  ctx.fillStyle = 'rgb(80, 66, 36)'
  ctx.fillRect(0, EARTH, canvas.width, canvas.height)
  ctx.font = '65px serif'
  ctx.fillStyle = 'rgb(180, 66, 36)'
  ctx.fillText('Game Over!',canvas.width/2 - 140, canvas.height/2)

}

function draw(ts) {
  ctx.fillStyle = 'rgb(85,120,225)'
  ctx.fillRect(0, 0, canvas.width, EARTH)
  ctx.fillStyle = 'rgb(80, 66, 36)'
  ctx.fillRect(0, EARTH, canvas.width, canvas.height)
  bird.draw(ctx, Math.floor(frame))
  trees.forEach((tree) => {
    tree.draw(ctx, Math.floor(frame))
  })
  rocks.forEach((rock) => {
    rock.draw(ctx, Math.floor(frame))
  })
  coin.draw(ctx, Math.floor(frame))
  frame = (frame + 0.1) % 4
  update(ts)
  score_lbl.textContent = 'Score: ' + score
  if (!game_over) requestAnimationFrame(draw)
  else drawGameOver()
  
}



draw(0)
