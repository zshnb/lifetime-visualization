import { debounce } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface RectangleTypes {
  label: string;
  backgroundColor: string;
}

export default function RectangleZone(props: {
  rectangleTypes: RectangleTypes[];
}) {
  const [types, setTypes] = useState<RectangleTypes[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    debounce(() => setTypes(props.rectangleTypes), 1000);
  }, [props.rectangleTypes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let y = 10; // Initial Y position

    types.forEach((type) => {
      const squareSize = 50; // Adjust this as needed for your square size
      const padding = 10; // Adjust this as needed for spacing
      const squareX = 10; // X position of the square

      // Draw rounded square
      ctx.fillStyle = type.backgroundColor;
      ctx.beginPath();
      ctx.moveTo(squareX + squareSize / 2, y);
      ctx.arc(squareX + squareSize / 2, y + squareSize / 2, squareSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = "black";
      ctx.fillText(type.label, squareX + squareSize + padding, y + squareSize / 2);

      // Update Y position for the next square
      y += squareSize + padding * 2;
    });

    // Resize the canvas to match the content
    canvas.height = y;
  }, [types]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      style={{ width: "100%" }}
    ></canvas>
  );
}
