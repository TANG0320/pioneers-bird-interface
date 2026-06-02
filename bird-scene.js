window.birdSceneBoot = { phase: "module-started" };

try {
const canvas = document.getElementById("bird-canvas");
const host = document.querySelector(".specimen");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
camera.position.set(0.1, 0.55, 5.1);
camera.position.set(0.08, 0.44, 6.1);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} else {
  renderer.outputEncoding = THREE.sRGBEncoding;
}
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.78;

scene.add(new THREE.AmbientLight(0xcdefff, 0.72));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.55);
keyLight.position.set(2.6, 4, 4);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x55c7ff, 1.45);
rimLight.position.set(-3.4, 2.5, -2.5);
scene.add(rimLight);

const floorLight = new THREE.PointLight(0x5ac4ff, 6, 8);
floorLight.position.set(0, -1.4, 1.6);
scene.add(floorLight);

const rig = new THREE.Group();
const model = new THREE.Group();
rig.add(model);
scene.add(rig);

const palette = {
  primary: new THREE.Color("#0f8ed8"),
  secondary: new THREE.Color("#064c86"),
  dark: new THREE.Color("#062f5a"),
  warm: new THREE.Color("#f2a35f"),
};

const bodyMat = new THREE.MeshPhysicalMaterial({
  color: palette.primary,
  roughness: 0.58,
  metalness: 0.03,
  clearcoat: 0.24,
  clearcoatRoughness: 0.32,
});

const wingMat = new THREE.MeshPhysicalMaterial({
  color: palette.secondary,
  roughness: 0.64,
  metalness: 0.02,
  clearcoat: 0.16,
});

const darkMat = new THREE.MeshStandardMaterial({
  color: palette.dark,
  roughness: 0.52,
});

const featherMat = new THREE.MeshStandardMaterial({
  color: 0x0b6fb0,
  roughness: 0.66,
  metalness: 0.02,
});

const eyeMat = new THREE.MeshPhysicalMaterial({
  color: 0x07131e,
  roughness: 0.18,
  metalness: 0.1,
  clearcoat: 1,
});

const beakMat = new THREE.MeshPhysicalMaterial({
  color: 0x7b4c36,
  roughness: 0.42,
  clearcoat: 0.25,
});

const legMat = new THREE.MeshStandardMaterial({
  color: 0x3a2c2b,
  roughness: 0.7,
});

const glowMat = new THREE.MeshBasicMaterial({
  color: 0x58c7ff,
  transparent: true,
  opacity: 0.26,
  side: THREE.DoubleSide,
});

function ellipsoid(name, colorMat, scale, position, rotation = [0, 0, 0], segments = 48) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, Math.floor(segments / 2)), colorMat);
  mesh.name = name;
  mesh.scale.set(...scale);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  model.add(mesh);
  return mesh;
}

const body = ellipsoid("body", bodyMat, [1.08, 0.72, 0.62], [-0.18, 0.08, 0], [0.02, -0.08, -0.1]);
const chest = ellipsoid("chest glow", bodyMat, [0.58, 0.48, 0.52], [0.35, 0.02, 0.09], [0, 0.2, -0.08], 36);
const head = ellipsoid("head", bodyMat, [0.48, 0.44, 0.42], [0.82, 0.56, 0.05], [0.05, -0.14, 0.05], 48);
const throat = ellipsoid("throat", bodyMat, [0.32, 0.28, 0.3], [0.55, 0.33, 0.08], [0, 0, -0.3], 32);

const leftWing = ellipsoid("left wing", wingMat, [0.68, 0.16, 0.4], [-0.2, 0.11, 0.49], [-0.18, 0.42, -0.48], 40);
const rightWing = ellipsoid("right wing", wingMat, [0.58, 0.13, 0.28], [-0.34, 0.12, -0.39], [-0.18, -0.42, -0.3], 32);

const featherGroup = new THREE.Group();
for (let i = 0; i < 7; i += 1) {
  const feather = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.42 - i * 0.022, 10), featherMat);
  feather.position.set(-0.26 - i * 0.055, 0.02 - i * 0.014, 0.72 + i * 0.012);
  feather.rotation.set(0.12, 0.3, 1.66 - i * 0.035);
  feather.scale.set(1, 1, 0.42);
  featherGroup.add(feather);
}
model.add(featherGroup);

const tail = new THREE.Group();
for (let i = 0; i < 4; i += 1) {
  const feather = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.78, 12), darkMat);
  feather.position.set(-1.05 - i * 0.06, -0.02 - i * 0.018, (i - 1.5) * 0.09);
  feather.rotation.set(0.18, 0.42, 1.72 + (i - 1.5) * 0.05);
  feather.scale.set(1, 1.05 - i * 0.08, 0.72);
  tail.add(feather);
}
model.add(tail);

const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.66, 28), beakMat);
beak.position.set(1.36, 0.56, 0.05);
beak.rotation.set(0, 0, -Math.PI / 2);
beak.scale.set(1, 1.15, 0.62);
model.add(beak);

for (const z of [0.35, -0.2]) {
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, 24, 16), eyeMat);
  eye.position.set(1.03, 0.68, z);
  if (z > 0) eye.scale.setScalar(1.55);
  model.add(eye);

  const glint = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  glint.position.set(1.065, 0.697, z + 0.027);
  if (z > 0) glint.scale.setScalar(1.45);
  model.add(glint);
}

const crest = new THREE.Group();
for (let i = 0; i < 4; i += 1) {
  const plume = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.28 - i * 0.025, 9), featherMat);
  plume.position.set(0.72 - i * 0.035, 0.96 + i * 0.012, 0.02);
  plume.rotation.set(0.25, 0.1 - i * 0.06, -0.35 - i * 0.16);
  crest.add(plume);
}
model.add(crest);

const feet = new THREE.Group();
for (const z of [0.18, -0.16]) {
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.5, 12), legMat);
  leg.position.set(0.18, -0.68, z);
  leg.rotation.z = 0.12;
  feet.add(leg);

  for (let i = 0; i < 3; i += 1) {
    const toe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.28, 8), legMat);
    toe.position.set(0.22 + i * 0.06, -0.93, z + (i - 1) * 0.035);
    toe.rotation.set(Math.PI / 2, 0.2 - i * 0.18, Math.PI / 2.4);
    feet.add(toe);
  }
}
model.add(feet);

const ringGroup = new THREE.Group();
for (let i = 0; i < 3; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72 + i * 0.24, 0.012, 10, 96), glowMat.clone());
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.96 - i * 0.006;
  ring.material.opacity = 0.25 - i * 0.045;
  ringGroup.add(ring);
}
scene.add(ringGroup);

const particleCount = 72;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 0.9 + Math.random() * 0.9;
  particlePositions[i * 3] = Math.cos(angle) * radius;
  particlePositions[i * 3 + 1] = -0.78 + Math.random() * 1.95;
  particlePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.42;
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
const particles = new THREE.Points(
  particlesGeo,
  new THREE.PointsMaterial({
    color: 0x82d8ff,
    size: 0.025,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  }),
);
scene.add(particles);

model.scale.setScalar(0.78);
model.rotation.set(-0.05, -0.64, 0.05);

let paused = false;
let locked = false;
let reactionStart = -1;
let lastTime = performance.now();
let elapsed = 0;
let pointerX = 0;
let pointerY = 0;
let targetRotX = -0.05;
let targetRotY = -0.64;
let dragStart = null;
let baseRotation = { x: targetRotX, y: targetRotY };
const homeRotationY = -0.64;

function resize() {
  const rect = host.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * 1.14));
  const height = Math.max(1, Math.floor(rect.height * 1.13));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resize).observe(host);
resize();

function setUnit(unit) {
  const color = new THREE.Color(unit.tint || "#2d9cf1");
  const secondary = color.clone().offsetHSL(-0.02, 0.03, -0.18);
  const feather = color.clone().offsetHSL(-0.03, 0.12, -0.08);
  const glow = color.clone().offsetHSL(0.02, 0.08, 0.14);
  bodyMat.color.copy(color);
  wingMat.color.copy(secondary);
  featherMat.color.copy(feather);
  glowMat.color.copy(glow);
  ringGroup.children.forEach((ring, index) => {
    ring.material.color.copy(glow);
    ring.material.opacity = locked ? 0.14 - index * 0.025 : 0.25 - index * 0.045;
  });
  particles.material.color.copy(glow);
}

function react() {
  reactionStart = elapsed;
}

function setPaused(value) {
  paused = value;
}

function setLocked(value) {
  locked = value;
  bodyMat.roughness = locked ? 0.72 : 0.46;
  wingMat.roughness = locked ? 0.74 : 0.55;
  particles.material.opacity = locked ? 0.25 : 0.55;
}

function pointerToLocal(event) {
  const rect = host.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
    y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
  };
}

host.addEventListener("pointerdown", (event) => {
  host.setPointerCapture(event.pointerId);
  dragStart = { x: event.clientX, y: event.clientY };
  baseRotation = { x: targetRotX, y: targetRotY };
});

host.addEventListener("pointermove", (event) => {
  const local = pointerToLocal(event);
  pointerX = local.x;
  pointerY = local.y;
  if (dragStart) {
    targetRotY = baseRotation.y + (event.clientX - dragStart.x) * 0.011;
    targetRotX = THREE.MathUtils.clamp(baseRotation.x + (event.clientY - dragStart.y) * 0.008, -0.62, 0.42);
  } else {
    targetRotY = homeRotationY + pointerX * 0.18;
    targetRotX = -0.05 + pointerY * 0.08;
  }
});

host.addEventListener("pointerup", (event) => {
  if (dragStart && Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y) < 5) {
    react();
  }
  dragStart = null;
});

host.addEventListener("pointercancel", () => {
  dragStart = null;
});

function animate(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  if (!paused) elapsed += delta;

  const reactProgress = reactionStart >= 0 ? (elapsed - reactionStart) / 0.76 : 99;
  if (reactProgress > 1) reactionStart = -1;

  const hop = reactProgress <= 1 ? Math.sin(reactProgress * Math.PI) * 0.46 : 0;
  const flap = reactProgress <= 1 ? Math.sin(reactProgress * Math.PI * 6) * 0.72 : 0;
  const idle = Math.sin(elapsed * 2.2) * 0.055;
  const breathe = Math.sin(elapsed * 3.1) * 0.03;

  rig.rotation.x += (targetRotX - rig.rotation.x) * 0.075;
  rig.rotation.y += (targetRotY - rig.rotation.y) * 0.075;
  rig.position.y = idle + hop;
  rig.rotation.z = Math.sin(elapsed * 1.4) * 0.025 - hop * 0.15;

  head.rotation.y = -0.18 + pointerX * 0.18 + flap * 0.03;
  head.rotation.x = pointerY * -0.09;
  body.scale.set(1.08 + breathe, 0.72 - breathe * 0.3, 0.62 + breathe * 0.25);
  chest.scale.set(0.58 + breathe * 0.45, 0.48, 0.52);
  leftWing.rotation.z = -0.48 - Math.abs(flap) - Math.sin(elapsed * 4.4) * 0.04;
  rightWing.rotation.z = -0.3 + Math.abs(flap) * 0.75 + Math.sin(elapsed * 4.2) * 0.035;
  featherGroup.rotation.z = leftWing.rotation.z * 0.18 - Math.abs(flap) * 0.12;
  crest.rotation.z = Math.sin(elapsed * 3.8) * 0.035 + flap * 0.04;
  tail.rotation.z = Math.sin(elapsed * 3.4) * 0.08 + hop * 0.18;
  feet.position.y = hop > 0 ? -hop * 0.32 : 0;

  ringGroup.rotation.z += paused ? 0 : delta * 0.36;
  ringGroup.scale.setScalar(1 + Math.sin(elapsed * 2.7) * 0.018);
  particles.rotation.y += paused ? 0 : delta * 0.05;
  particles.position.y = Math.sin(elapsed * 1.5) * 0.04;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.birdScene = {
  react,
  setUnit,
  setPaused,
  setLocked,
  debugState: () => ({
    paused,
    locked,
    meshCount: model.children.length + tail.children.length + feet.children.length + ringGroup.children.length,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
  }),
};

window.birdSceneBoot.phase = "ready";
requestAnimationFrame(animate);
} catch (error) {
  window.birdSceneBoot = {
    phase: "failed",
    message: error && error.message ? error.message : String(error),
  };
  console.error("3D bird scene failed", error);
}
