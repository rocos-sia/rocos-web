import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

export function createViewer(host: HTMLElement): () => void {
  const status = host.querySelector<HTMLElement>('[data-model-status]')!;
  const canvas = host.querySelector<HTMLCanvasElement>('canvas')!;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch {
    status.textContent = '三维显示不可用，请查看模型静态图或使用支持 WebGL 的浏览器。';
    host.dataset.state = 'error';
    host.querySelectorAll<HTMLButtonElement>('button').forEach(button => button.disabled = true);
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.01, 30);
  camera.up.set(0, 0, 1);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = 0.65;
  controls.maxDistance = 4;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0, 0, 0.54);
  const home = new THREE.Vector3(1.65, -2.25, 1.35);
  const target = new THREE.Vector3(0, 0, 0.54);
  let framingDistance = 0;
  const render = () => renderer.render(scene, camera);
  const reset = () => {
    if (framingDistance) home.copy(target).add(new THREE.Vector3(1.65, -2.25, 0.85).normalize().multiplyScalar(framingDistance * Math.max(1, 0.95 / (host.clientWidth / Math.max(host.clientHeight, 1)))));
    camera.position.copy(home); controls.target.copy(target); controls.update(); render(); };
  reset();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7a8899, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 3);
  key.position.set(2, -3, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -1.5; key.shadow.camera.right = 1.5;
  key.shadow.camera.top = 1.5; key.shadow.camera.bottom = -1.5;
  key.shadow.normalBias = 0.015;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd8e7ff, 1.5);
  rim.position.set(-2, 2, 2); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.035, 96), new THREE.MeshStandardMaterial({ color: 0xdde3ec, metalness: 0.25, roughness: 0.6 }));
  ground.rotation.x = Math.PI / 2; ground.position.z = -0.025; ground.receiveShadow = true; scene.add(ground);
  const material = new THREE.MeshStandardMaterial({ color: 0xf2f0e9, metalness: 0.22, roughness: 0.34 });
  const resources: THREE.BufferGeometry[] = [ground.geometry];
  let disposed = false;
  let modelReady = false;
  const pending = new AbortController();
  const extraMaterials: THREE.Material[] = [];
  const resize = () => {
    const width = host.clientWidth; const height = host.clientHeight;
    renderer.setSize(width, height, false); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); reset();
  };
  const observer = new ResizeObserver(resize); observer.observe(host);
  controls.addEventListener('change', render);
  const onClick = (event: Event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-view]')?.dataset.view;
    if (!action) return;
    if (action === 'reset') reset();
    if (action === 'left' || action === 'right') {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 0, 1), action === 'left' ? 0.3 : -0.3);
      camera.position.copy(controls.target).add(offset); controls.update();
    }
    if (action === 'in' || action === 'out') {
      const offset = camera.position.clone().sub(controls.target);
      const length = THREE.MathUtils.clamp(offset.length() * (action === 'in' ? 0.85 : 1.15), controls.minDistance, controls.maxDistance);
      camera.position.copy(controls.target).add(offset.setLength(length)); controls.update();
    }
    render();
  };
  host.addEventListener('click', onClick);
  const dispose = () => {
    if (disposed) return;
    disposed = true; pending.abort(); observer.disconnect(); controls.dispose(); renderer.dispose();
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', contextRestored);
    resources.forEach(resource => resource.dispose()); material.dispose(); extraMaterials.forEach(item => item.dispose());
    (ground.material as THREE.Material).dispose(); host.removeEventListener('click', onClick);
  };
  const setControlsDisabled = (disabled: boolean) => host.querySelectorAll<HTMLButtonElement>('button').forEach(button => button.disabled = disabled);
  const contextLost = (event: Event) => {
    event.preventDefault();
    host.dataset.state = 'error';
    status.textContent = '三维显示已中断，当前显示静态图；可刷新页面重试。';
    setControlsDisabled(true);
  };
  const contextRestored = () => {
    if (disposed) return;
    host.dataset.state = modelReady ? 'ready' : 'loading';
    status.textContent = modelReady ? 'Talon · 模型预览' : '正在加载 Talon 模型…';
    setControlsDisabled(!modelReady); resize();
  };
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  const loadModel = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}models/talon/source.urdf`, { signal: pending.signal });
    if (!response.ok) throw new Error('URDF unavailable');
    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Invalid URDF');
    const links = new Map<string, THREE.Group>();
    const loader = new STLLoader();
    const vector = (text: string | null) => (text || '0 0 0').trim().split(/\s+/).map(Number) as [number, number, number];
    const transform = (object: THREE.Object3D, origin: Element | null) => {
      object.position.fromArray(vector(origin?.getAttribute('xyz') ?? null));
      const [r, p, y] = vector(origin?.getAttribute('rpy') ?? null);
      object.quaternion.setFromEuler(new THREE.Euler(r, p, y, 'ZYX'));
    };
    await Promise.all([...xml.querySelectorAll('robot > link')].map(async link => {
      const group = new THREE.Group(); group.name = link.getAttribute('name')!; links.set(group.name, group);
      const visual = link.querySelector('visual'); const file = visual?.querySelector('mesh')?.getAttribute('filename')?.split('/').pop();
      if (!file) return;
      const meshResponse = await fetch(`${import.meta.env.BASE_URL}models/talon/${file}`, { signal: pending.signal });
      if (!meshResponse.ok) throw new Error('Mesh unavailable');
      const buffer = await meshResponse.arrayBuffer();
      if (disposed) return;
      const raw = loader.parse(buffer);
      raw.deleteAttribute('normal');
      const geometry = mergeVertices(raw); raw.dispose();
      resources.push(geometry);
      if (disposed) { geometry.dispose(); return; }
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, material); transform(mesh, visual?.querySelector('origin') ?? null);
      mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);
    }));
    if (disposed || !host.isConnected) { dispose(); return () => {}; }
    const pose = [0, -0.55, 0, -1.65, 0, 1.1, 0.4];
    [...xml.querySelectorAll('robot > joint')].forEach((joint, index) => {
      const parent = links.get(joint.querySelector('parent')!.getAttribute('link')!)!;
      const child = links.get(joint.querySelector('child')!.getAttribute('link')!)!;
      const pivot = new THREE.Group(); transform(pivot, joint.querySelector('origin'));
      const axis = new THREE.Vector3(...vector(joint.querySelector('axis')?.getAttribute('xyz') ?? '0 0 1')).normalize();
      pivot.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(axis, pose[index] || 0));
      parent.add(pivot); pivot.add(child);
    });
    const robot = links.get('base_link')!; scene.add(robot);
    robot.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(robot);
    bounds.getCenter(target);
    const size = bounds.getSize(new THREE.Vector3());
    // Frame the actual robot, not the world origin or the decorative ground.
    framingDistance = Math.max(size.z, size.x, size.y) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.3;
    reset();
    const axes = new THREE.AxesHelper(0.12); links.get('link_7')?.add(axes); resources.push(axes.geometry); extraMaterials.push(...(Array.isArray(axes.material) ? axes.material : [axes.material]));
    modelReady = true;
    if (!renderer.getContext().isContextLost()) {
      status.textContent = 'Talon · 模型预览'; host.dataset.state = 'ready'; setControlsDisabled(false);
    }
    resize();
  } catch (error) {
    if (!disposed) {
      status.textContent = '模型加载失败，请刷新重试；也可查看下方静态图。'; host.dataset.state = 'error';
      host.querySelectorAll<HTMLButtonElement>('button').forEach(button => button.disabled = true);
      console.error('Talon model:', error);
    }
  }
  };
  void loadModel();
  return dispose;
}
