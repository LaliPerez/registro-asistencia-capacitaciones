import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}

export interface SignaturePadHandle {
  clear: () => void;
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(({ onSave, onClear }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const getCanvasContext = () => canvasRef.current?.getContext('2d') || null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(ratio, ratio);
        context.strokeStyle = '#334155'; // slate-700
        context.lineWidth = 2;
        context.lineCap = 'round';
      }
    }
  }, []);

  const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.nativeEvent instanceof MouseEvent) {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    } else if (e.nativeEvent instanceof TouchEvent) {
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else {
        return { x: 0, y: 0 };
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const context = getCanvasContext();
    if (!context) return;
    const { x, y } = getCoords(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const context = getCanvasContext();
    if (!context) return;
    const { x, y } = getCoords(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const context = getCanvasContext();
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
    if (canvasRef.current) {
        onSave(canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = getCanvasContext();
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
      onClear();
    }
  };

  useImperativeHandle(ref, () => ({
    clear: handleClear,
  }));

  return (
    <div className="w-full">
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg relative aspect-video md:aspect-[2.5/1]">
         {!hasSigned && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <p className="text-slate-400">Firme en este recuadro</p>
           </div>
         )}
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Limpiar Firma
        </button>
      </div>
    </div>
  );
});
