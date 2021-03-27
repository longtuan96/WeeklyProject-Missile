//Initialize the canvas

const canvas = document.getElementById("canvas");
canvas.width = innerWidth; //make the canvas full screen
canvas.height = innerHeight; //^ same
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreEl");

//define a player
class Player {
  constructor(x, y, radius, color) {
    //constructor is a builder for a class. it will create a object with below property
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  //adding draw function for class Player
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

//define the bullet
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//define Enemy
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//define Particles
const friction = 0.98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1; //value for disappear after sometime
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

//Creating a player
const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 10, "white");

//create enemies\
const enemies = [];
//Function to spawn Enemies
function spawnEnemy() {
  setInterval(() => {
    let radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    //Enemy spawn point
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else if (Math.random() > 0.5) {
      y = Math.random() > 0.5 ? 0 - radius : canvas.height + radius;
      x = Math.random() * canvas.width;
    }

    let color = `hsl(${Math.random() * 360},50%,50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 2000);
}
//creating bullet
const particles = [];
const projectiles = []; //array contains all the bullet current onscreen
let animation;
let score = 0;
function animate() {
  animation = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  player.draw();
  projectiles.forEach((projectile, projectileIndex) => {
    projectile.update();
    //remove bullet at the edge of the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distToPlayer - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animation);
    }
    //hit on enemy detection
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1) {
        //create particles on hit
        for (let index = 0; index < enemy.radius * 2; index++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }

        if (enemy.radius - 10 > 10) {
          //enemy shrink on hit
          score += 100;
          scoreEl.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            score += 250;
            scoreEl.innerHTML = score;
            enemies.splice(enemyIndex, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });

  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  });
}
animate();
spawnEnemy();
//every time clicked spawn a bullet in the middle
addEventListener("click", (event) => {
  //everytime there is an event, do below
  const angle = Math.atan2(
    //angle to destionation
    //atan2 function using x axis first then y axis
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const speedBullet = 5;
  const velocity = {
    x: Math.cos(angle) * speedBullet,
    y: Math.sin(angle) * speedBullet,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});
