// Pointer/wheel/touch interaction: drag to pan, wheel to zoom-to-cursor, pinch to
// zoom on touch, double-click to zoom in. One Pointer Events path (no mouse/touch
// branching). Mutates the camera directly and notifies the engine so it can drop
// to interactive resolution and refine on idle.
import type { Engine } from './engine';
import { MAX_ZOOM } from './engine';
import { zoomAt, panByPixels } from './camera';
import { clamp } from '../util/math';

const MIN_ZOOM = -3;

export const attachInput = (
  canvas: HTMLCanvasElement,
  engine: Engine,
  onChange: () => void,
): (() => void) => {
  const pointers = new Map<number, { x: number; y: number }>();
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pinchDist = 0;

  const rect = () => canvas.getBoundingClientRect();
  const local = (e: PointerEvent): [number, number] => {
    const r = rect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const clampZoom = () => {
    engine.scene.camera.zoomLevel = clamp(engine.scene.camera.zoomLevel, MIN_ZOOM, MAX_ZOOM);
  };

  const onPointerDown = (e: PointerEvent) => {
    canvas.setPointerCapture(e.pointerId);
    const [x, y] = local(e);
    pointers.set(e.pointerId, { x, y });
    if (pointers.size === 1) {
      dragging = true;
      lastX = x;
      lastY = y;
      canvas.classList.add('dragging');
    } else if (pointers.size === 2) {
      const pts = [...pointers.values()];
      pinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) return;
    const [x, y] = local(e);
    pointers.set(e.pointerId, { x, y });
    const r = rect();

    if (pointers.size >= 2) {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const midX = (pts[0].x + pts[1].x) / 2;
      const midY = (pts[0].y + pts[1].y) / 2;
      if (pinchDist > 0 && dist > 0) {
        const dz = Math.log2(dist / pinchDist);
        zoomAt(engine.scene.camera, midX, midY, r.width, r.height, dz);
        clampZoom();
      }
      pinchDist = dist;
      engine.notifyInteraction();
      onChange();
      return;
    }

    if (dragging) {
      panByPixels(engine.scene.camera, x - lastX, y - lastY, r.height);
      lastX = x;
      lastY = y;
      engine.notifyInteraction();
      onChange();
    }
  };

  const endPointer = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchDist = 0;
    if (pointers.size === 0) {
      dragging = false;
      canvas.classList.remove('dragging');
    }
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const r = rect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    // ~0.5 log2 units per wheel notch (a slightly stronger trackpad step).
    const dz = -Math.sign(e.deltaY) * 0.5;
    zoomAt(engine.scene.camera, px, py, r.width, r.height, dz);
    clampZoom();
    engine.notifyInteraction();
    onChange();
  };

  const onDblClick = (e: MouseEvent) => {
    const r = rect();
    zoomAt(engine.scene.camera, e.clientX - r.left, e.clientY - r.top, r.width, r.height, 1.0);
    clampZoom();
    engine.notifyInteraction();
    onChange();
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('dblclick', onDblClick);

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', endPointer);
    canvas.removeEventListener('pointercancel', endPointer);
    canvas.removeEventListener('wheel', onWheel);
    canvas.removeEventListener('dblclick', onDblClick);
  };
};
