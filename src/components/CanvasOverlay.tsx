import { useEffect, useRef } from "react";

interface CanvasOverlayProps {
  imageUrl: string;
  landmarks: any;
  imageElement: HTMLImageElement | null;
}

export const CanvasOverlay = ({ imageUrl, landmarks, imageElement }: CanvasOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !landmarks || !imageElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match displayed image
    const rect = imageElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Calculate scale factors
    const scaleX = rect.width / imageElement.naturalWidth;
    const scaleY = rect.height / imageElement.naturalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landmarks
    ctx.strokeStyle = "#6b8afd";
    ctx.fillStyle = "#6b8afd";
    ctx.lineWidth = 2;

    // Draw facial outline
    if (landmarks.positions) {
      ctx.beginPath();
      landmarks.positions.forEach((point: any, i: number) => {
        const x = point._x * scaleX;
        const y = point._y * scaleY;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        // Draw point
        ctx.fillRect(x - 2, y - 2, 4, 4);
      });
      ctx.stroke();
    }
  }, [landmarks, imageElement, imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
