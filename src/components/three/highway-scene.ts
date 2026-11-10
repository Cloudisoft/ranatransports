import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Night-highway WebGL scene: a branded tractor-trailer cruising through a
 * neon-lit industrial corridor. Everything is procedural (no model files) so
 * the scene stays small and loads fast. Returns a disposer.
 */

const BRAND = {
  amber: 0xffb547,
  flame: 0xff7a2f,
  magenta: 0xfc1f86,
  orchid: 0xcc2dd3,
  indigo: 0x5b4cf0,
  sky: 0x1db3ff,
};

type Options = {
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  /** Fraction of the viewport width to shift the subject to the right (desktop composition) */
  offset?: number;
  onReady?: () => void;
};

function sideTexture() {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 512;
  const g = c.getContext("2d")!;
  const bg = g.createLinearGradient(0, 0, 0, 512);
  bg.addColorStop(0, "#1b2436");
  bg.addColorStop(1, "#0b111d");
  g.fillStyle = bg;
  g.fillRect(0, 0, 2048, 512);
  // corrugation
  g.fillStyle = "rgba(255,255,255,0.035)";
  for (let x = 0; x < 2048; x += 28) g.fillRect(x, 0, 6, 512);
  // brand band
  const band = g.createLinearGradient(0, 0, 2048, 0);
  band.addColorStop(0, "#ffb547");
  band.addColorStop(0.3, "#ff7a2f");
  band.addColorStop(0.5, "#fc1f86");
  band.addColorStop(0.72, "#cc2dd3");
  band.addColorStop(1, "#1db3ff");
  g.fillStyle = band;
  g.fillRect(0, 330, 2048, 26);
  g.globalAlpha = 0.35;
  g.fillRect(0, 362, 2048, 6);
  g.globalAlpha = 1;
  g.fillStyle = "#ffffff";
  g.font = "700 150px 'Space Grotesk Variable', 'Space Grotesk', Arial, sans-serif";
  g.textBaseline = "alphabetic";
  const word = "R A N A";
  g.fillText(word, 150, 270);
  g.font = "600 46px 'Inter Variable', Inter, Arial, sans-serif";
  g.fillStyle = "rgba(255,255,255,0.75)";
  g.fillText("T R A N S P O R T   &   L O G I S T I C S", 158, 440);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function windowsTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 128, 256);
  const colors = ["#ffcf8a", "#ffb547", "#9fdcff", "#ff7ac0"];
  for (let y = 8; y < 256; y += 14) {
    for (let x = 8; x < 128; x += 14) {
      if (Math.random() < 0.28) {
        g.fillStyle = colors[(Math.random() * colors.length) | 0];
        g.globalAlpha = 0.4 + Math.random() * 0.6;
        g.fillRect(x, y, 6, 8);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function radialTexture(inner = "rgba(0,0,0,0.85)", outer = "rgba(0,0,0,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, inner);
  r.addColorStop(1, outer);
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function buildTruck(env: { side: THREE.Texture }) {
  const truck = new THREE.Group();

  const pearl = new THREE.MeshPhysicalMaterial({ color: 0xf2f4f8, metalness: 0.35, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x141b27, metalness: 0.5, roughness: 0.5 });
  const black = new THREE.MeshStandardMaterial({ color: 0x07090d, roughness: 0.8 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe6f0, metalness: 1, roughness: 0.18 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0b2747, metalness: 0.2, roughness: 0.05, transmission: 0, clearcoat: 1, emissive: 0x0a2a55, emissiveIntensity: 0.35 });
  const head = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
  const tail = new THREE.MeshBasicMaterial({ color: 0xff2a4a });
  const stripe = new THREE.MeshBasicMaterial({ color: BRAND.magenta });

  // ── trailer (container) ──
  const containerMats = [
    graphite, // +x (front)
    graphite, // -x (rear)
    graphite, // +y
    graphite, // -y
    new THREE.MeshStandardMaterial({ map: env.side, metalness: 0.3, roughness: 0.55 }), // +z
    new THREE.MeshStandardMaterial({ map: env.side, metalness: 0.3, roughness: 0.55 }), // -z
  ];
  const container = new THREE.Mesh(new RoundedBoxGeometry(9.2, 2.75, 2.5, 3, 0.06), containerMats);
  container.position.set(-0.9, 2.62, 0);
  truck.add(container);
  // rear doors detail
  const doorBars = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.5, 0.08), chrome);
  for (const z of [-0.6, 0.6]) {
    const b = doorBars.clone();
    b.position.set(-5.52, 2.62, z);
    truck.add(b);
  }
  for (const z of [-1.05, 1.05]) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.3), tail);
    t.position.set(-5.52, 1.25, z);
    truck.add(t);
  }

  // ── chassis ──
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.32, 1.6), black);
  chassis.position.set(0.3, 0.95, 0);
  truck.add(chassis);

  // ── tractor cab ──
  const cab = new THREE.Mesh(new RoundedBoxGeometry(2.3, 2.7, 2.5, 4, 0.22), pearl);
  cab.position.set(5.65, 2.25, 0);
  truck.add(cab);
  const fairing = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.9, 2.4, 3, 0.2), pearl);
  fairing.position.set(5.05, 3.85, 0);
  fairing.rotation.z = 0.32;
  truck.add(fairing);
  // windshield
  const ws = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 2.2), glass);
  ws.position.set(6.79, 2.95, 0);
  truck.add(ws);
  // side windows
  for (const z of [-1.26, 1.26]) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.85, 0.04), glass);
    sw.position.set(6.05, 2.95, z);
    truck.add(sw);
    // brand stripe on cab doors
    const st = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.02), stripe);
    st.position.set(5.65, 1.85, z * 1.005);
    truck.add(st);
    // mirror
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.35), black);
    arm.position.set(6.75, 2.95, z + Math.sign(z) * 0.18);
    truck.add(arm);
    const mir = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.5, 0.22, 2, 0.04), black);
    mir.position.set(6.75, 2.85, z + Math.sign(z) * 0.38);
    truck.add(mir);
  }
  // grille + bumper
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 1.5), black);
  grille.position.set(6.81, 1.72, 0);
  truck.add(grille);
  for (let i = 0; i < 6; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 1.45), chrome);
    bar.position.set(6.84, 1.36 + i * 0.14, 0);
    truck.add(bar);
  }
  const bumper = new THREE.Mesh(new RoundedBoxGeometry(0.35, 0.42, 2.5, 2, 0.08), graphite);
  bumper.position.set(6.78, 1.02, 0);
  truck.add(bumper);

  // headlights + beams
  const beams: THREE.Mesh[] = [];
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0.085, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  for (const z of [-0.95, 0.95]) {
    const h = new THREE.Mesh(new RoundedBoxGeometry(0.08, 0.18, 0.42, 2, 0.04), head);
    h.position.set(6.84, 1.42, z);
    truck.add(h);
    const beam = new THREE.Mesh(new THREE.ConeGeometry(2.2, 14, 24, 1, true), beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(13.9, 1.0, z * 1.4);
    truck.add(beam);
    beams.push(beam);
  }
  const roofLights = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), new THREE.MeshBasicMaterial({ color: BRAND.amber }));
  roofLights.position.set(5.8, 4.25, 0);
  truck.add(roofLights);

  // ── wheels ──
  const wheels: THREE.Object3D[] = [];
  const tyreGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.38, 28);
  const rimGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12);
  const hubGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.42, 8);
  const spokeGeo = new THREE.BoxGeometry(0.5, 0.41, 0.07);
  const axles = [6.05, 3.55, 2.55, -3.1, -4.1, -5.0];
  for (const x of axles) {
    for (const z of [-1.08, 1.08]) {
      const w = new THREE.Group();
      const tyre = new THREE.Mesh(tyreGeo, black);
      const rim = new THREE.Mesh(rimGeo, chrome);
      const hub = new THREE.Mesh(hubGeo, graphite);
      // one spoke bar makes the rotation readable at a single draw call
      const spoke = new THREE.Mesh(spokeGeo, graphite);
      w.add(tyre, rim, hub, spoke);
      w.rotation.x = Math.PI / 2;
      w.position.set(x, 0.53, z);
      truck.add(w);
      wheels.push(w);
    }
  }
  // mudflaps
  for (const z of [-1.08, 1.08]) {
    const flap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.55, 0.42), black);
    flap.position.set(-5.6, 0.62, z);
    truck.add(flap);
  }

  // contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 4.2),
    new THREE.MeshBasicMaterial({ map: radialTexture(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.5, 0.012, 0);
  truck.add(shadow);

  return { truck, wheels, beams };
}

export function createHighwayScene({ canvas, reducedMotion, offset = 0, onReady }: Options) {
  const mobile = window.innerWidth < 768 || window.matchMedia("(hover: none)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(mobile ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, window.innerWidth > 1600 ? 1.25 : 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070a14, 0.018);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
  const camBase = new THREE.Vector3(25, 6.2, 24);
  const lookAt = new THREE.Vector3(-0.8, 1.7, -4.6);

  // lights
  scene.add(new THREE.HemisphereLight(0x5b6dff, 0x0b0b12, 0.55));
  const key = new THREE.DirectionalLight(0xffd2a1, 1.6);
  key.position.set(18, 14, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(BRAND.magenta, 2.2);
  rim.position.set(-14, 6, -10);
  scene.add(rim);
  const fill = new THREE.PointLight(BRAND.sky, 30, 30, 1.6);
  fill.position.set(2, 6, 8);
  scene.add(fill);
  const headSpot = new THREE.SpotLight(0xfff1d6, 120, 45, 0.5, 0.6, 1.4);
  scene.add(headSpot, headSpot.target);

  // road
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 15),
    new THREE.MeshStandardMaterial({ color: 0x0a0e17, roughness: 0.52, metalness: 0.15 }),
  );
  road.rotation.x = -Math.PI / 2;
  scene.add(road);
  const shoulder = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 120),
    new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 1 }),
  );
  shoulder.rotation.x = -Math.PI / 2;
  shoulder.position.y = -0.02;
  scene.add(shoulder);

  // neon road edges
  const edge = (z: number, color: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(500, 0.04, 0.12), new THREE.MeshBasicMaterial({ color }));
    m.position.set(0, 0.02, z);
    scene.add(m);
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 1.6),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.set(0, 0.015, z);
    scene.add(glow);
  };
  edge(-7.4, BRAND.sky);
  edge(7.4, BRAND.magenta);
  // median (gold)
  const median = new THREE.Mesh(new THREE.BoxGeometry(500, 0.03, 0.14), new THREE.MeshBasicMaterial({ color: 0xd5ae62 }));
  median.position.set(0, 0.02, 0.2);
  scene.add(median);

  // lane dashes (instanced, recycled)
  const DASH_GAP = 7;
  const DASHES = 70;
  const dashes = new THREE.InstancedMesh(new THREE.BoxGeometry(3, 0.02, 0.14), new THREE.MeshBasicMaterial({ color: 0xe8ecf4 }), DASHES * 2);
  const dashX: number[] = [];
  const dm = new THREE.Matrix4();
  for (let i = 0; i < DASHES; i++) dashX.push(-200 + i * DASH_GAP);
  scene.add(dashes);

  // street lamps
  const LAMPS = mobile ? 14 : 24;
  const LAMP_GAP = 24;
  const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.09, 7, 6), new THREE.MeshStandardMaterial({ color: 0x1b2230, roughness: 0.6 }), LAMPS);
  const lampHead = new THREE.InstancedMesh(new THREE.BoxGeometry(1.1, 0.12, 0.35), new THREE.MeshBasicMaterial({ color: 0xffcf8a }), LAMPS);
  const pool = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(9, 9),
    new THREE.MeshBasicMaterial({ map: radialTexture("rgba(255,190,110,0.55)", "rgba(255,190,110,0)"), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    LAMPS,
  );
  const lampX: number[] = [];
  for (let i = 0; i < LAMPS; i++) lampX.push(-220 + i * LAMP_GAP);
  scene.add(pole, lampHead, pool);

  // skyline (instanced, slow parallax)
  const BUILDINGS = mobile ? 40 : 90;
  const winTex = windowsTexture();
  const bMat = new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.9, emissive: 0xffffff, emissiveMap: winTex, emissiveIntensity: 0.55 });
  const buildings = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), bMat, BUILDINGS);
  const bData: { x: number; z: number; w: number; h: number; d: number }[] = [];
  for (let i = 0; i < BUILDINGS; i++) {
    const far = i % 2 === 0;
    bData.push({
      x: -200 + Math.random() * 400,
      z: far ? -(28 + Math.random() * 40) : 26 + Math.random() * 30,
      w: 5 + Math.random() * 8,
      h: 6 + Math.random() * (far ? 34 : 16),
      d: 5 + Math.random() * 8,
    });
  }
  scene.add(buildings);
  // port cranes (static silhouettes on the horizon)
  const craneMat = new THREE.MeshBasicMaterial({ color: 0x0d1424 });
  for (const [x, z] of [
    [-60, -90],
    [-20, -100],
    [40, -95],
  ]) {
    const g = new THREE.Group();
    const leg = new THREE.Mesh(new THREE.BoxGeometry(1.2, 30, 1.2), craneMat);
    leg.position.y = 15;
    const boom = new THREE.Mesh(new THREE.BoxGeometry(34, 1.4, 1.4), craneMat);
    boom.position.set(6, 28, 0);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff2a4a }));
    beacon.position.set(22, 29, 0);
    g.add(leg, boom, beacon);
    g.position.set(x, 0, z);
    scene.add(g);
  }

  // light trails (oncoming traffic + speed streaks)
  const TRAILS = mobile ? 22 : 46;
  const trailGeo = new THREE.PlaneGeometry(1, 1);
  const trailMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: false });
  const trails = new THREE.InstancedMesh(trailGeo, trailMat, TRAILS);
  const tData: { x: number; y: number; z: number; len: number; speed: number }[] = [];
  const palette = [BRAND.magenta, BRAND.sky, BRAND.amber, BRAND.orchid, 0xffffff, 0xff2a4a];
  const col = new THREE.Color();
  for (let i = 0; i < TRAILS; i++) {
    const oncoming = i % 3 !== 0;
    tData.push({
      x: -200 + Math.random() * 400,
      y: 0.35 + Math.random() * 1.1,
      z: oncoming ? 1.4 + Math.random() * 5.6 : -(1.0 + Math.random() * 2.2),
      len: 4 + Math.random() * 10,
      speed: oncoming ? -(60 + Math.random() * 50) : 25 + Math.random() * 20,
    });
    trails.setColorAt(i, col.set(palette[i % palette.length]));
  }
  scene.add(trails);

  // truck
  const { truck, wheels, beams } = buildTruck({ side: sideTexture() });
  truck.position.set(0, 0, -5.5);
  scene.add(truck);
  headSpot.position.set(7.2, 1.6, -5.5);
  headSpot.target.position.set(30, 0, -5.5);

  // interaction
  const pointer = new THREE.Vector2(0, 0);
  const target = new THREE.Vector2(0, 0);
  const onPointer = (e: PointerEvent) => {
    target.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let width = 0;
  let height = 0;
  let shift = 0;
  const aim = new THREE.Vector3();
  const right = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);
  /** Look slightly left of the truck so it sits in the right part of the frame (desktop). */
  const aimCamera = () => {
    aim.copy(lookAt);
    if (shift) {
      const dir = aim.clone().sub(camera.position);
      const dist = dir.length();
      right.crossVectors(dir.normalize(), UP).normalize();
      const halfW = dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      aim.addScaledVector(right, -halfW * 2 * shift);
    }
    camera.lookAt(aim);
  };
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    shift = width >= 1024 ? offset : 0;
    camera.fov = width < 640 ? 44 : 32;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const SPEED = 26; // world units / s
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const sVec = new THREE.Vector3();
  const pVec = new THREE.Vector3();
  const flat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const ident = new THREE.Quaternion();

  const layout = (t: number, dt: number) => {
    const move = SPEED * dt;
    // dashes (two lanes)
    for (let i = 0; i < DASHES; i++) {
      dashX[i] -= move;
      if (dashX[i] < -200) dashX[i] += DASHES * DASH_GAP;
      dm.makeTranslation(dashX[i], 0.021, -3.6);
      dashes.setMatrixAt(i, dm);
      dm.makeTranslation(dashX[i] + 3.5, 0.021, 3.9);
      dashes.setMatrixAt(i + DASHES, dm);
    }
    dashes.instanceMatrix.needsUpdate = true;
    // lamps
    for (let i = 0; i < LAMPS; i++) {
      lampX[i] -= move;
      if (lampX[i] < -220) lampX[i] += LAMPS * LAMP_GAP;
      const side = i % 2 === 0 ? -9.2 : 9.2;
      m.makeTranslation(lampX[i], 3.5, side);
      pole.setMatrixAt(i, m);
      m.makeTranslation(lampX[i], 7, side * 0.9);
      lampHead.setMatrixAt(i, m);
      m.compose(pVec.set(lampX[i], 0.025, side * 0.62), flat, sVec.set(1, 1, 1));
      pool.setMatrixAt(i, m);
    }
    pole.instanceMatrix.needsUpdate = lampHead.instanceMatrix.needsUpdate = pool.instanceMatrix.needsUpdate = true;
    // buildings
    for (let i = 0; i < BUILDINGS; i++) {
      const b = bData[i];
      b.x -= move * (Math.abs(b.z) > 40 ? 0.25 : 0.55);
      if (b.x < -200) b.x += 400;
      m.compose(pVec.set(b.x, b.h / 2, b.z), ident, sVec.set(b.w, b.h, b.d));
      buildings.setMatrixAt(i, m);
    }
    buildings.instanceMatrix.needsUpdate = true;
    // trails
    for (let i = 0; i < TRAILS; i++) {
      const d = tData[i];
      d.x += (d.speed - SPEED) * dt;
      if (d.x < -200) d.x += 400;
      if (d.x > 200) d.x -= 400;
      m.compose(pVec.set(d.x, d.y, d.z), q, sVec.set(d.len, 0.06, 1));
      trails.setMatrixAt(i, m);
    }
    trails.instanceMatrix.needsUpdate = true;
    // truck life
    const spin = (move / 0.53) * -1;
    for (const w of wheels) w.rotateY(spin);
    truck.position.y = Math.sin(t * 9) * 0.012;
    truck.rotation.x = Math.sin(t * 0.9) * 0.004;
    for (const b of beams) (b.material as THREE.MeshBasicMaterial).opacity = 0.075 + Math.sin(t * 13) * 0.004;
  };

  let raf = 0;
  let last = performance.now();
  let running = false;
  let elapsed = 0;
  let first = true;

  // adaptive quality: if the device can't keep up, drop resolution, then freeze to a still
  let slowFrames = 0;
  let sampled = 0;
  let degraded = 0;
  const adapt = (ms: number) => {
    sampled++;
    if (ms > 34) slowFrames++;
    if (sampled < 90) return;
    if (slowFrames / sampled > 0.35) {
      if (degraded === 0) {
        renderer.setPixelRatio(0.75);
        resize();
        degraded = 1;
      } else {
        degraded = 2;
        stop();
      }
    }
    sampled = 0;
    slowFrames = 0;
  };

  const frame = (now: number) => {
    const ms = now - last;
    const dt = Math.min(0.05, ms / 1000);
    last = now;
    adapt(ms);
    elapsed += dt;
    layout(elapsed, dt);
    pointer.lerp(target, 0.04);
    camera.position.set(camBase.x - pointer.x * 1.4, camBase.y - pointer.y * 0.6 + Math.sin(elapsed * 0.4) * 0.08, camBase.z + pointer.x * 0.8);
    aimCamera();
    renderer.render(scene, camera);
    if (first) {
      first = false;
      onReady?.();
    }
    if (running) raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || reducedMotion || degraded === 2) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // first (static) frame — also the reduced-motion presentation
  layout(0, 0.0001);
  camera.position.copy(camBase);
  aimCamera();
  renderer.render(scene, camera);
  onReady?.();
  first = false;

  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.01 });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onPointer);
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((mm) => mm.dispose());
      else mat?.dispose();
    });
    envRT.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}
