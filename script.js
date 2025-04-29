const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const roadWidth = 2000;
const segmentLength = 200;
const rumbleLength = 3;
const cameraHeight = 1000;
const drawDistance = 300;
const playerZ = cameraHeight * 1.5;
const fieldOfView = 100;
const segments = [];

let position = 0;
let speed = 150;
let playerX = 0;
let playerDX = 0;
const maxSpeed = 300;

const keyState = {
  left: false,
  right: false,
  up: false,
  down: false
};

// Load car image
const carImage = new Image();
carImage.src = 'car.png'; // Ensure this path is correct

// Build the road
for (let i = 0; i < 500; i++) {
  segments.push({
    index: i,
    curve: Math.sin(i / 30) * 2,
    y: Math.sin(i / 60) * 1500
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keyState.left = true;
  if (e.key === 'ArrowRight') keyState.right = true;
  if (e.key === 'ArrowUp') keyState.up = true;
  if (e.key === 'ArrowDown') keyState.down = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keyState.left = false;
  if (e.key === 'ArrowRight') keyState.right = false;
  if (e.key === 'ArrowUp') keyState.up = false;
  if (e.key === 'ArrowDown') keyState.down = false;
});

function project(p, cameraX, cameraY, cameraZ) {
  const dz = p.world.z - cameraZ;
  const scale = fieldOfView / dz;
  return {
    x: (1 + (p.world.x - cameraX) * scale) * canvas.width / 2,
    y: (1 - (p.world.y - cameraY) * scale) * canvas.height / 2,
    w: scale * roadWidth * canvas.width / 2
  };
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player input
  if (keyState.left) playerDX -= 0.2;
  if (keyState.right) playerDX += 0.2;
  if (keyState.up && speed < maxSpeed) speed += 5;
  if (keyState.down && speed > 0) speed -= 5;

  playerX += playerDX;
  playerDX *= 0.9; // friction

  let baseSegment = Math.floor(position / segmentLength);
  let offsetZ = position % segmentLength;
  let x = 0, dx = 0;

  for (let n = 0; n < drawDistance; n++) {
    const segment = segments[(baseSegment + n) % segments.length];
    segment.p1 = { world: { x: x, y: segment.y, z: (baseSegment + n) * segmentLength - offsetZ }};
    x += dx;
    dx += segment.curve;

    segment.p2 = { world: { x: x + dx, y: segments[(baseSegment + n + 1) % segments.length].y, z: (baseSegment + n + 1) * segmentLength - offsetZ }};

    const p1 = project(segment.p1, playerX, 1500, playerZ);
    const p2 = project(segment.p2, playerX, 1500, playerZ);

    ctx.fillStyle = (Math.floor(segment.index / rumbleLength) % 2 === 0) ? '#444' : '#555';
    ctx.beginPath();
    ctx.moveTo(p1.x - p1.w, p1.y);
    ctx.lineTo(p1.x + p1.w, p1.y);
    ctx.lineTo(p2.x + p2.w, p2.y);
    ctx.lineTo(p2.x - p2.w, p2.y);
    ctx.closePath();
    ctx.fill();
  }

  // Draw car image
  const carWidth = 50;
  const carHeight = 100;
  const carX = canvas.width / 2 - carWidth / 2 + playerX;
  const carY = canvas.height - carHeight - 20;

  ctx.drawImage(carImage, carX, carY, carWidth, carHeight);

  position += speed;

  requestAnimationFrame(render);
}

// Start rendering after the car image has loaded
carImage.onload = () => {
  render();
};
