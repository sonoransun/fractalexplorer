// PNG export + Web Share. The canvas uses preserveDrawingBuffer:false, so we must
// draw a fresh frame and read it back in the SAME synchronous task — `drawNow()`
// renders, then toBlob() is called immediately, before the browser composites/clears.
export const saveCanvasPng = (
  canvas: HTMLCanvasElement,
  drawNow: () => void,
  filename = 'fractal-explorer.png',
): void => {
  drawNow();
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
};

/** Returns true if the native share sheet handled it; false to fall back to download. */
export const shareCanvas = async (canvas: HTMLCanvasElement, drawNow: () => void): Promise<boolean> => {
  drawNow();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return false;
  const file = new File([blob], 'fractal-explorer.png', { type: 'image/png' });
  const nav = navigator as Navigator & {
    canShare?: (d: { files: File[] }) => boolean;
    share?: (d: { files: File[]; title?: string; text?: string }) => Promise<void>;
  };
  if (nav.canShare?.({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: 'Fractal Explorer' });
      return true;
    } catch {
      return false;
    }
  }
  return false;
};
