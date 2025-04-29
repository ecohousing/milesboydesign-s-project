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
const roadSegments = [];

let position = 0;
let speed = 200;
let playerX = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') playerX -= 5;
  if (e.key === 'ArrowRight') playerX += 5;
  if (e.key === 'ArrowUp') speed += 10;
  if (e.key === 'ArrowDown') speed -= 10;
});

// Build road
for (let i = 0; i < 500; i++) {
  roadSegments.push({
    index: i,
    curve: Math.sin(i / 30) * 2,
    y: Math.sin(i / 60) * 1500
  });
}

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

  let baseSegment = Math.floor(position / segmentLength);
  let offsetZ = position % segmentLength;
  let x = 0, dx = 0;

  for (let n = 0; n < drawDistance; n++) {
    const segment = roadSegments[(baseSegment + n) % roadSegments.length];
    segment.p1 = { world: { x: x, y: segment.y, z: (baseSegment + n) * segmentLength - offsetZ }};
    x += dx;
    dx += segment.curve;

    segment.p2 = { world: { x: x + dx, y: roadSegments[(baseSegment + n + 1) % roadSegments.length].y, z: (baseSegment + n + 1) * segmentLength - offsetZ }};

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

  position += speed;

  requestAnimationFrame(render);
}

render();

