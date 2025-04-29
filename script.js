const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game settings
const roadWidth = 2000;
const segmentLength = 200;
const rumbleLength = 3;
const cameraHeight = 1000;
const drawDistance = 300;
const playerZ = cameraHeight * 1.5;
const fieldOfView = 100;
const segments = [];

// Player settings
let position = 0;
let speed = 150;
let playerX = 0;
let playerDX = 0;
const maxSpeed = 300;

// Key input state
const keyState = { left: false, right: false, up: false, down: false };

// Create the road segments
for (let i = 0; i < 500; i++) {
  segments.push({
    index: i,
    curve: Math.sin(i / 30) * 2,
    y: Math.sin(i / 60) * 500
  });
}

// Handle key input
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

// Road texture
const roadImage = new Image();
roadImage.src = 'road_texture.png'; // Add your road texture image path

// Car image
const carImage = new Image();
carImage.src = 'car_sprite.png'; // Add your car image path

// Function to project world coordinates to 2D canvas space
function project(p, cameraX, cameraY, cameraZ) {
  const dz = p.world.z - cameraZ;
  const scale = fieldOfView / dz;
  return {
    x: (1 + (p.world.x - cameraX) * scale) * canvas.width / 2,
    y: (1 - (p.world.y - cameraY) * scale) * canvas.height / 2,
    w: scale * roadWidth * canvas.width / 2
  };
}

// Function to draw trees in the background
function drawTree(x, y, scale) {
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(x, y, scale * 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#654321';
  ctx.fillRect(x - scale * 2, y, scale * 4, scale * 10);
}

// Function to draw mountains in the background
function drawMountain(x, y, scale) {
  ctx.fillStyle = '#8B4513'; // Brown color for mountains
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - scale * 50, y + scale * 100);
  ctx.lineTo(x + scale * 50, y + scale * 100);
  ctx.closePath();
  ctx.fill();
}

// Function to draw the speedometer
function drawSpeedometer(speed) {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Speed: ${Math.floor(speed)} km/h`, 10, 30);
}

// Function to render the game
roadImage.onload = () => {
  carImage.onload = () => {
    function render() {
      // Fill the background with the sky color
      ctx.fillStyle = '#87ceeb'; // Sky blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Handle player movement
      if (keyState.left) playerDX -= 0.2;
      if (keyState.right) playerDX += 0.2;
      if (keyState.up && speed < maxSpeed) speed += 5;
      if (keyState.down && speed > 0) speed -= 5;

      playerX += playerDX;
      playerDX *= 0.9;

      let baseSegment = Math.floor(position / segmentLength);
      let offsetZ = position % segmentLength;
      let x = 0, dx = 0;

      // Loop through each road segment
      for (let n = 0; n < drawDistance; n++) {
        const segment = segments[(baseSegment + n) % segments.length];
        segment.p1 = { world: { x: x, y: segment.y, z: (baseSegment + n) * segmentLength - offsetZ }};
        x += dx;
        dx += segment.curve;

        segment.p2 = {
          world: { 
            x: x + dx,
            y: segments[(baseSegment + n + 1) % segments.length].y,
            z: (baseSegment + n + 1) * segmentLength - offsetZ
          }
        };

        const p1 = project(segment.p1, playerX, 1500, playerZ);
        const p2 = project(segment.p2, playerX, 1500, playerZ);

        // Draw the road texture
        ctx.drawImage(roadImage, p1.x - p1.w, p1.y, p1.w * 2, p2.y - p1.y);
        ctx.drawImage(roadImage, p2.x - p2.w, p2.y, p2.w * 2, p2.y - p1.y);

        // Draw trees on the sides
        if (n % 10 === 0) {
          drawTree(p1.x - p1.w - 40, p1.y - 20, 1);
          drawTree(p1.x + p1.w + 40, p1.y - 20, 1);
        }

        // Draw mountains in the background
        if (n % 20 === 0) {
          drawMountain(p1.x, p1.y - 100, 2);
        }
      }

      // Draw the car
      const carWidth = 50;
      const carHeight = 100;
      const carX = canvas.width / 2 - carWidth / 2 + playerX;
      const carY = canvas.height - carHeight - 20;
      ctx.drawImage(carImage, carX, carY, carWidth, carHeight);

      // Draw the speedometer
      drawSpeedometer(speed);

      position += speed;
      requestAnimationFrame(render);
    }

    render(); // Start the game loop
  };
};
