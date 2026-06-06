import { describe, it, expect } from 'vitest';
import { defaultScene } from '../src/app/scene';
import { screenToComplex, zoomAt, panByPixels, worldHeight } from '../src/app/camera';

describe('camera', () => {
  it('keeps the complex point under the cursor fixed across zoom (zoom-to-cursor)', () => {
    const cam = defaultScene().camera;
    const W = 800;
    const H = 600;
    const px = 523;
    const py = 187;
    const before = screenToComplex(cam, px, py, W, H);
    zoomAt(cam, px, py, W, H, 3.25);
    const after = screenToComplex(cam, px, py, W, H);
    expect(after[0]).toBeCloseTo(before[0], 9);
    expect(after[1]).toBeCloseTo(before[1], 9);
  });

  it('worldHeight halves per +1 zoom level', () => {
    const cam = defaultScene().camera;
    const h0 = worldHeight(cam);
    cam.zoomLevel += 1;
    expect(worldHeight(cam)).toBeCloseTo(h0 / 2, 12);
  });

  it('pan moves the center opposite to the drag direction', () => {
    const cam = defaultScene().camera;
    const before = cam.centerX;
    panByPixels(cam, 100, 0, 600); // drag right -> view content shifts, center moves left
    expect(cam.centerX).toBeLessThan(before);
  });
});
