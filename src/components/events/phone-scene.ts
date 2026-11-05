import { ACESFilmicToneMapping, BoxGeometry, DirectionalLight, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, Scene, Shape, ShapeGeometry, WebGLRenderer } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

// Everything is measured in the screen's own pixels, the size of a real phone.
export const SCREEN = { width: 390, height: 844 };
const BEZEL = 12;
const DEPTH = 26;
const EDGE = 7;
const BODY = { width: SCREEN.width + BEZEL * 2, height: SCREEN.height + BEZEL * 2, radius: 64 };
const LENS = 22;

function rounded(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - radius);
  shape.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + height);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
  return shape;
}

/**
 * A phone modelled in three.js, with the real DOM element `screen` set into its face by a matching
 * CSS 3D layer. The body gets true metal and light from WebGL, and the chat stays sharp, selectable text.
 */
export function createPhone(host: HTMLElement, screen: HTMLElement) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(LENS, 1, 10, 30000);

  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none";

  const layer = new CSS3DRenderer();
  layer.domElement.style.position = "absolute";
  layer.domElement.style.inset = "0";
  layer.domElement.style.pointerEvents = "none";
  host.append(renderer.domElement, layer.domElement);

  // A soft studio, built in code, gives the metal something to reflect.
  const studio = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const reflections = studio.fromScene(room, 0.04).texture;
  scene.environment = reflections;
  const key = new DirectionalLight(0xffffff, 0.5);
  key.position.set(-500, 800, 1200);
  scene.add(key);

  // Matte on purpose: glossy glass catches the studio and turns the bezel white at an angle.
  const metal = new MeshStandardMaterial({ color: 0x1d1e21, metalness: 0.85, roughness: 0.58, envMapIntensity: 0.45 });
  const glass = new MeshStandardMaterial({ color: 0x060607, metalness: 0, roughness: 0.75, envMapIntensity: 0.08 });

  const phone = new Group();
  scene.add(phone);

  const bodyShape = new ExtrudeGeometry(rounded(BODY.width - EDGE * 2, BODY.height - EDGE * 2, BODY.radius - EDGE), {
    depth: DEPTH - EDGE * 2,
    bevelEnabled: true,
    bevelThickness: EDGE,
    bevelSize: EDGE,
    bevelSegments: 8,
    curveSegments: 32,
  });
  bodyShape.center();
  phone.add(new Mesh(bodyShape, metal));

  const faceShape = new ShapeGeometry(rounded(BODY.width - 5, BODY.height - 5, BODY.radius - 3), 32);
  const face = new Mesh(faceShape, glass);
  face.position.z = DEPTH / 2 + 0.5;
  phone.add(face);

  const buttons = [
    { x: BODY.width / 2 + 1, y: 190, height: 110 },
    { x: -BODY.width / 2 - 1, y: 230, height: 60 },
    { x: -BODY.width / 2 - 1, y: 140, height: 60 },
  ].map(({ x, y, height }) => {
    const button = new Mesh(new BoxGeometry(5, height, 9), metal);
    button.position.set(x, y, 0);
    phone.add(button);
    return button;
  });

  // The layer places the screen from the top left, so it drops the centring it has while flat.
  screen.style.left = "0";
  screen.style.top = "0";
  const display = new CSS3DObject(screen);
  display.position.z = DEPTH / 2 + 1;
  phone.add(display);

  function fit() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    camera.aspect = width / height;
    camera.position.z = height / 2 / Math.tan((LENS / 2) * (Math.PI / 180));
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    layer.setSize(width, height);
    phone.scale.setScalar(Math.min((height * 0.94) / BODY.height, (width * 0.86) / BODY.width));
  }

  function render(tiltX: number, turnY: number, lift: number) {
    phone.rotation.set(tiltX, turnY, 0);
    phone.position.y = lift;
    renderer.render(scene, camera);
    layer.render(scene, camera);
  }

  function dispose() {
    phone.remove(display);
    bodyShape.dispose();
    faceShape.dispose();
    buttons.forEach((button) => button.geometry.dispose());
    metal.dispose();
    glass.dispose();
    reflections.dispose();
    studio.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    layer.domElement.remove();
  }

  return { fit, render, dispose };
}
