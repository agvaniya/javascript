const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const score_lbl = document.querySelector("#score");
const sounds = [
  new Audio("/blup1.wav"),
  new Audio("/blup2.wav"),
  new Audio("/blup3.mp3"),
];
const FPS = 60;
let score = 0;

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
  const theta = Math.atan2(p.y - y, p.x - x);
  enemies.push(
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

const projectiles = [];
const enemies = [];
const particles = [];
const p = new Player(canvas.width / 2, canvas.height / 2, 10);

const spawner = setInterval(spawn, 1000);

addEventListener("click", (event) => {
  const x = event.x - canvas.parentElement.offsetLeft;
  const y = event.y - canvas.parentElement.offsetTop;
  dx = x - p.x;
  if (dx === 0) dx = 0.1;
  const dy = y - p.y;
  const theta = Math.atan2(dy, dx);
  projectiles.push(
    new Projectile(p.x, p.y, 5, {
      x: 6 * Math.cos(theta),
      y: 6 * Math.sin(theta),
    })
  );
});

let back_ts = 0;

function draw(ts) {
  id = requestAnimationFrame(draw);

  if (ts - back_ts >= 1000 / FPS) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    // ctx.clearRect(0,0, canvas.width, canvas.height)
    p.draw(ctx);
    projectiles.forEach((pr, i) => {
      pr.draw(ctx);
      pr.update();
      if (
        pr.x - pr.radius > canvas.width ||
        pr.x + pr.radius < 0 ||
        pr.y - pr.radius > canvas.height ||
        pr.y + pr.radius < 0
      )
        setTimeout(() => {
          projectiles.splice(i, 1);
        });
    });

    enemies.forEach((en, i) => {
      en.update();
      en.draw(ctx);
      if (en.collide(p)) {
        setTimeout(() => {
          const snd = new Audio("/expl3.wav");
          snd.play();
        });
        console.log("end");
        cancelAnimationFrame(id);
        clearInterval(spawner);
      }
      projectiles.forEach((pr, ip) => {
        if (en.collide(pr)) {
          setTimeout(() => {
            sounds[Math.round(2 * Math.random())].play();
          });
          score += Math.round(5 * en.radius);
          score_lbl.textContent = `Score: ${score}`;

          for (let i = 0; i < 2 + (en.radius * Math.random()) / 4; i++) {
            const c = en.color;
            c.s = 100;
            c.a = 1;
            particles.push(new Particle(en.x, en.y, c));
          }

          setTimeout(() => {
            enemies.splice(i, 1);
            projectiles.splice(ip, 1);
          });
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
          enemies.splice(i, 1);
        });
    });
    particles.forEach((pa, i) => {
      pa.update();
      pa.draw(ctx);
      if (Math.hypot(pa.velocity.x, pa.velocity.y) < 0.2)
        setTimeout(() => {
          particles.splice(i, 1);
        });
    });
    back_ts = ts;
  }
}

draw(0);
