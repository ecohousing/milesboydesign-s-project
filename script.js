// Set up basic scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create player cube (3D character)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const playerCube = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(playerCube);

// Set initial player position
playerCube.position.y = 1;

// Create a simple island (a flat ground with some trees)
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2; // Rotate to lie flat
scene.add(ground);

// Create some basic trees (represented by cylinders)
function createTree(x, z) {
  const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.set(x, 1.5, z);
  scene.add(trunk);

  const canopyGeometry = new THREE.SphereGeometry(2, 8, 8);
  const canopyMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
  const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
  canopy.position.set(x, 4, z);
  scene.add(canopy);
}

// Create multiple trees scattered around the island
for (let i = 0; i < 10; i++) {
  const x = Math.random() * 100 - 50;
  const z = Math.random() * 100 - 50;
  createTree(x, z);
}

// Camera position
camera.position.z = 5;

// Basic movement variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let turnLeft = false;
let turnRight = false;
let moveSpeed = 0.1;
let rotationSpeed = 0.05;

// Handle key presses
document.addEventListener('keydown', (event) => {
  if (event.key === 'w') moveForward = true;
  if (event.key === 's') moveBackward = true;
  if (event.key === 'a') moveLeft = true;
  if (event.key === 'd') moveRight = true;
  if (event.key === 'q') turnLeft = true;
  if (event.key === 'e') turnRight = true;
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'w') moveForward = false;
  if (event.key === 's') moveBackward = false;
  if (event.key === 'a') moveLeft = false;
  if (event.key === 'd') moveRight = false;
  if (event.key === 'q') turnLeft = false;
  if (event.key === 'e') turnRight = false;
});

// Update function to handle movement and camera rotation
function update() {
  if (moveForward) playerCube.position.z -= moveSpeed;
  if (moveBackward) playerCube.position.z += moveSpeed;
  if (moveLeft) playerCube.position.x -= moveSpeed;
  if (moveRight) playerCube.position.x += moveSpeed;

  if (turnLeft) camera.rotation.y += rotationSpeed;
  if (turnRight) camera.rotation.y -= rotationSpeed;

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

// Start the game loop
update();
