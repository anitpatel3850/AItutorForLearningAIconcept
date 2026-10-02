import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Move, 
  Sparkles,
  Crop
} from 'lucide-react';
import { Button } from '../common/Button';
import { sound } from '../../utils/audio';

interface ImageCropModalProps {
  imageSrc: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset state when a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // Generate real-time circular crop preview
  const generateCroppedImage = useCallback((): string => {
    const img = imageRef.current;
    if (!img) return '';

    const canvas = document.createElement('canvas');
    const size = 320; // High resolution avatar
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Create circular clip path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Compute scale and position
    // Viewport is 240px wide in UI, canvas is 320px
    const viewportDiameter = 220;
    const ratio = size / viewportDiameter;

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    // Base scale to cover viewport
    const baseScale = Math.max(viewportDiameter / imgWidth, viewportDiameter / imgHeight);
    const currentScale = baseScale * zoom;

    const drawWidth = imgWidth * currentScale * ratio;
    const drawHeight = imgHeight * currentScale * ratio;

    const centerX = size / 2 + offset.x * ratio;
    const centerY = size / 2 + offset.y * ratio;

    const drawX = centerX - drawWidth / 2;
    const drawY = centerY - drawHeight / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    return canvas.toDataURL('image/webp', 0.92);
  }, [zoom, offset]);

  // Update preview when zoom or offset changes
  useEffect(() => {
    if (imageSrc && isOpen) {
      const data = generateCroppedImage();
      setPreviewUrl(data);
    }
  }, [imageSrc, isOpen, zoom, offset, generateCroppedImage]);

  // Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleApply = () => {
    sound.playCorrect();
    const result = generateCroppedImage();
    onConfirm(result);
  };

  const handleReset = () => {
    sound.playClick();
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0D1226] border border-cyan-500/30 p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">
                  Adjust Profile Photo
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Drag to pan • Slider to zoom
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Crop Viewport */}
          <div className="relative flex flex-col items-center justify-center select-none">
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="relative w-[240px] h-[240px] rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.3)] bg-slate-950 cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              {/* Image element being transformed */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop Source"
                draggable={false}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  maxWidth: 'none',
                  maxHeight: 'none',
                }}
                className="pointer-events-none select-none"
              />

              {/* Crop Grid Crosshairs */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-full">
                <div className="absolute inset-x-0 top-1/3 border-b border-white/15 border-dashed" />
                <div className="absolute inset-x-0 top-2/3 border-b border-white/15 border-dashed" />
                <div className="absolute inset-y-0 left-1/3 border-r border-white/15 border-dashed" />
                <div className="absolute inset-y-0 left-2/3 border-r border-white/15 border-dashed" />
              </div>

              {/* Move Indicator badge */}
              <div className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950/70 border border-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-1 pointer-events-none">
                <Move className="w-3 h-3" />
                <span>Pan / Drag</span>
              </div>
            </div>

            {/* Quick Live Circular Preview Badge */}
            {previewUrl && (
              <div className="mt-3 flex items-center gap-2.5 text-xs font-mono text-slate-400">
                <span>Preview:</span>
                <img
                  src={previewUrl}
                  alt="Final Preview"
                  className="w-9 h-9 rounded-full border border-cyan-400/60 object-cover shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Zoom Slider & Controls */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/70 border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Scale Magnification</span>
              </span>
              <span className="text-white font-bold">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
            >
              CANCEL
            </Button>

            <Button
              size="md"
              glow
              onClick={handleApply}
              icon={<Check className="w-4 h-4 stroke-[3]" />}
              iconPosition="right"
              className="text-slate-950 font-bold"
            >
              SAVE & APPLY
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
