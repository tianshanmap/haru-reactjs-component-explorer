import React, { useRef, useEffect, useState } from 'react';
import styles from "./canvasContainer.module.css";

function CanvasContainer({ width = 600, height = 400 }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial background Setup
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Style settings for drawing
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  }, [width, height]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  };

  return (
    <div className={styles.canvas_container}>
      <canvas
        className={styles.canvas_tag} 
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className={styles.canvas_operation}>
        <div className={styles.canvas_button_group}>
            <button className={styles.canvas_button} onClick={clearCanvas}>
                Clear Canvas
            </button>
            <button className={styles.canvas_button} onClick={clearCanvas}>
                Save Canvas
            </button>
            <button className={styles.canvas_button} onClick={clearCanvas}>
                Load Canvas
            </button>
        </div>
        <div className={styles.canvas_button_group}>
            <button className={styles.canvas_button} onClick={clearCanvas}>
                Clear Canvas
            </button>
            <button className={styles.canvas_button} onClick={clearCanvas}>
                Save Canvas
            </button>
            <button className={styles.canvas_button} onClick={clearCanvas}>
                Load Canvas
            </button>
        </div>
        <div className={styles.canvas_blank_group}>
        </div>
      </div>
    </div>
  );
};
export default CanvasContainer;
