const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");

let playerX = 125;
let score = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 25;
  } else if (e.key === "ArrowRight" && playerX < 250) {
    playerX += 25;
  }
  player.style.left = `${playerX}px`;
});

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = `${Math.floor(Math.random() * 6) * 50}px`;
  enemy.style.top = "0px";
  game.appendChild(enemy);
  moveEnemy(enemy);
}

function moveEnemy(enemy) {
  let position = 0;
  const interval = setInterval(() => {
    if (position >= 500) {
      clearInterval(interval);
      enemy.remove();
      score++;
      scoreEl.innerText = `Score: ${score}`;
      return;
    }

    position += 5;
    enemy.style.top = `${position}px`;

    // Collision detection
    const enemyX = parseInt(enemy.style.left);
    const enemyY = position;
    if (
      enemyY + 100 >= 400 &&
      enemyX === playerX
    ) {
      alert(`Game Over! Final Score: ${score}`);
      location.reload();
    }
  }, 30);
}

// Generate enemies
setInterval(createEnemy, 1000);
