const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const score_lbl = document.querySelector("#score");
const fin_score = document.querySelector("#finscore");
const sounds = [
  new Audio("blup1.wav"),
  new Audio("blup2.wav"),
  new Audio("blup3.mp3"),
];

class Context {
  constructor() {
    this.FPS = 60;
    this.score = 0;
    this.projectiles = [];
    this.enemies = [];
    this.particles = [];
    this.p = new Player(canvas.width / 2, canvas.height / 2, 10);
    this.spawner = null;
    score_lbl.textContent = `Score: ${this.score}`;
  }

  start() {
    fin_score.parentElement.style.visibility = "hidden";
    fin_score.parentElement.onclick = null;
    draw(0);
    this.spawner = setInterval(spawn, 1000);
  }
}

let c = new Context();

function spawn() {
  if (Math.random() < 0.4) {
    return;
  }
  const x =
    Math.random() > 0.5
      ? canvas.width + Math.random() * 300
      : -300 * Math.random();
  const y =
    Math.random() > 0.5
      ? canvas.width + Math.random() * 300
      : -300 * Math.random();
  const theta = Math.atan2(c.p.y - y, c.p.x - x);
  c.enemies.push(
    new Enemy(
      x,
      y,
      3 + 77 * Math.random(),
      {
        x: 3 * Math.cos(theta),
        y: 3 * Math.sin(theta),
      },
      { width: canvas.width, height: canvas.height }
    )
  );
}

addEventListener("click", (event) => {
  const x = event.x - canvas.parentElement.offsetLeft;
  const y = event.y - canvas.parentElement.offsetTop;
  dx = x - c.p.x;
  if (dx === 0) dx = 0.1;
  const dy = y - c.p.y;
  const theta = Math.atan2(dy, dx);
  c.projectiles.push(
    new Projectile(c.p.x, c.p.y, 5, {
      x: 6 * Math.cos(theta),
      y: 6 * Math.sin(theta),
    })
  );
});

let back_ts = 0;

function draw(ts) {
  id = requestAnimationFrame(draw);

  if (ts - back_ts >= 1000 / c.FPS) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    // ctx.clearRect(0,0, canvas.width, canvas.height)
    c.p.draw(ctx);
    c.projectiles.forEach((pr, i) => {
      pr.draw(ctx);
      pr.update();
      if (
        pr.x - pr.radius > canvas.width ||
        pr.x + pr.radius < 0 ||
        pr.y - pr.radius > canvas.height ||
        pr.y + pr.radius < 0
      )
        setTimeout(() => {
          c.projectiles.splice(i, 1);
        });
    });

    c.enemies.forEach((en, i) => {
      en.update();
      en.draw(ctx);
      if (en.collide(c.p)) {
        setTimeout(() => {
          const snd = new Audio("expl3.wav");
          snd.play();
        });
        fin_score.textContent = `Score: ${c.score}`;
        fin_score.parentElement.style.visibility = "visible";
        fin_score.parentElement.onclick = () => {
          c = new Context();
          c.start();
        };
        // the end
        cancelAnimationFrame(id);
        clearInterval(c.spawner);
      }
      c.projectiles.forEach((pr, ip) => {
        if (en.collide(pr)) {
          setTimeout(() => {
            sounds[Math.round(2 * Math.random())].play();
          });
          c.score += 50;
          score_lbl.textContent = `Score: ${c.score}`;

          for (let i = 0; i < 2 + (en.radius * Math.random()) / 4; i++) {
            const clr = en.color.clone();
            clr.s = 100;
            clr.a = 1;
            c.particles.push(new Particle(en.x, en.y, clr));
          }
          if (en.radius > 30) {
            en.shrink = 5;
            setTimeout(() => {
              c.projectiles.splice(ip, 1);
            });
          } else {
            setTimeout(() => {
              c.enemies.splice(i, 1);
              c.projectiles.splice(ip, 1);
            });
          }
        }
      });
      if (
        en.destructibe &&
        (en.x - en.radius > canvas.width ||
          en.x + en.radius < 0 ||
          en.y - en.radius > canvas.height ||
          en.y + en.radius < 0)
      )
        setTimeout(() => {
          c.enemies.splice(i, 1);
        });
    });
    c.particles.forEach((pa, i) => {
      pa.update();
      pa.draw(ctx);
      if (Math.hypot(pa.velocity.x, pa.velocity.y) < 0.2)
        setTimeout(() => {
          c.particles.splice(i, 1);
        });
    });
    back_ts = ts;
  }
}

c.start();
