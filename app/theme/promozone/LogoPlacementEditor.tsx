'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage, faUpload, faTrashCan, faCrosshairs, faRotateLeft, faMinus, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import type { LogoPlacement } from './promozone.data';

type LogoPlacementEditorProps = {
  productImage: string;
  printPositionLabel?: string;
  value: LogoPlacement | null;
  onChange: (placement: LogoPlacement | null) => void;
  className?: string;
};

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function LogoPlacementEditor({
  productImage,
  printPositionLabel,
  value,
  onChange,
  className,
}: LogoPlacementEditorProps) {
  // Editör ömrü boyunca yerel state kaynaktır; başlangıç prop'tan lazy alınır.
  const [p, setP] = useState<LogoPlacement | null>(() => value);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const pRef = useRef<LogoPlacement | null>(p);
  useEffect(() => {
    pRef.current = p;
  }, [p]);

  function commit(next: LogoPlacement | null) {
    setP(next);
    onChange(next);
  }

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      commit({
        dataUrl: String(reader.result),
        fileName: file.name,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      });
    };
    reader.readAsDataURL(file);
  }

  // Fare tekerleğiyle zoom (passive:false gerektiğinden effect ile bağlanır)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    function onWheel(e: WheelEvent) {
      const cur = pRef.current;
      if (!cur) return;
      e.preventDefault();
      const next = clamp(cur.scale + (e.deltaY < 0 ? 0.06 : -0.06), MIN_SCALE, MAX_SCALE);
      const np = { ...cur, scale: Math.round(next * 100) / 100 };
      setP(np);
      onChange(np);
    }
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [onChange]);

  function onPointerDown(e: React.PointerEvent) {
    if (!p) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    drag.current = { sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y };
    setDragging(true);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !p) return;
    setP({ ...p, x: drag.current.ox + (e.clientX - drag.current.sx), y: drag.current.oy + (e.clientY - drag.current.sy) });
  }
  function onPointerUp() {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (pRef.current) onChange(pRef.current);
  }

  function update(patch: Partial<LogoPlacement>) {
    if (!p) return;
    commit({ ...p, ...patch });
  }

  // ── Boş durum: yükleme alanı ──
  if (!p) {
    return (
      <div className={cn('space-y-1.5', className)}>
        <span className="block text-sm font-medium text-text-primary">Logo placement</span>
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) readFile(f);
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-base px-4 py-8 text-center',
            'transition-colors hover:border-primary hover:bg-surface-overlay',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-border-focus',
          )}
        >
          <input
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) readFile(f);
            }}
          />
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true">
            <FontAwesomeIcon icon={faImage} className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-text-primary">Upload your logo</span>
          <span className="text-xs text-text-secondary">Drag &amp; drop or click to select · PNG, SVG, JPG</span>
        </label>
      </div>
    );
  }

  // ── Yerleştirme sahnesi + kontroller ──
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">Logo placement</span>
        {printPositionLabel && (
          <span className="text-xs text-text-secondary">Print position: {printPositionLabel}</span>
        )}
      </div>

      {/* Sahne: ürün görseli + baskı alanı + logo */}
      <div
        ref={stageRef}
        className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-surface-sunken"
      >
        <img src={productImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-40" />

        {/* Baskı alanı */}
        <div
          className="absolute overflow-hidden rounded-md border-2 border-dashed border-primary/70"
          style={{ left: '20%', top: '25%', width: '60%', height: '50%' }}
        >
          <img
            src={p.dataUrl}
            alt="Uploaded logo"
            draggable={false}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="absolute left-1/2 top-1/2 max-h-[80%] max-w-[80%]"
            style={{
              transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`,
              cursor: dragging ? 'grabbing' : 'grab',
            }}
          />
        </div>

        <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white">
          Print area
        </span>
      </div>

      {/* Zoom */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Zoom</span>
          <span className="tabular-nums">{Math.round(p.scale * 100)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => update({ scale: Math.round(clamp(p.scale - 0.1, MIN_SCALE, MAX_SCALE) * 100) / 100 })}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <FontAwesomeIcon icon={faMinus} className="h-3 w-3" aria-hidden="true" />
          </button>
          <input
            type="range"
            aria-label="Zoom"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.05}
            value={p.scale}
            onChange={(e) => update({ scale: Number(e.target.value) })}
            className="h-2 flex-1 cursor-pointer accent-[var(--primary)]"
          />
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => update({ scale: Math.round(clamp(p.scale + 0.1, MIN_SCALE, MAX_SCALE) * 100) / 100 })}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Döndürme */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Rotate</span>
          <span className="tabular-nums">{p.rotation}°</span>
        </div>
        <input
          type="range"
          aria-label="Rotate"
          min={-180}
          max={180}
          step={1}
          value={p.rotation}
          onChange={(e) => update({ rotation: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer accent-[var(--primary)]"
        />
      </div>

      {/* Hizalama + eylemler */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => update({ x: 0, y: 0 })}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faCrosshairs} className="h-3 w-3" aria-hidden="true" />
          Center
        </button>
        <button
          type="button"
          onClick={() => update({ x: 0, y: 0, scale: 1, rotation: 0 })}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faRotateLeft} className="h-3 w-3" aria-hidden="true" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faUpload} className="h-3 w-3" aria-hidden="true" />
          Replace
        </button>
        <button
          type="button"
          onClick={() => commit(null)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-error hover:bg-error-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faTrashCan} className="h-3 w-3" aria-hidden="true" />
          Remove
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) readFile(f);
          }}
        />
      </div>

      <p className="truncate text-xs text-text-secondary">{p.fileName}</p>
    </div>
  );
}
