import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

export interface BubbleOption {
  id: string;
  label?: string;
  labelKey?: string;
}

interface BubblePatternProps {
  options: BubbleOption[];
  selectedValue?: string;
  selectedValues?: string[];
  onSelect: (value: string) => void;
  className?: string;
}

const BUBBLES_PER_ROW = 3;
const CENTER_OFFSET_RATIO = 0.5; // middle bubble goes down half its height

// Helper to determine size. Base size 80px max size 130px.
const getBubbleSize = (text: string, minSize: number, maxSize: number) => {
  const length = text.length;
  // Increase size for longer text to fit it inside a circle
  const estimatedSize = minSize + (length > 5 ? (length - 5) * 4 : 0);
  return Math.min(estimatedSize, maxSize);
};

export const BubblePattern: React.FC<BubblePatternProps> = ({
  options,
  selectedValue,
  selectedValues,
  onSelect,
  className
}) => {
  const { t } = useTranslation();
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container using ResizeObserver
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isSelected = (id: string) =>
    selectedValues
      ? selectedValues.includes(id)
      : selectedValue === id;

  const bubbleLayout = useMemo(() => {
    if (containerWidth === 0) return { bubbles: [], height: 0 };
    
    // Config values aligned with native logic
    const BUBBLE_GAP = 12; // horizontal gap
    const BUBBLE_ROW_GAP = 16; // vertical gap
    const minSize = 85; // ~hp(8) min width
    let maxSize = 140; // ~hp(16) absolute max
    
    // Dynamic cell size to fit 3 in a row
    const availableCellWidth = (containerWidth - (BUBBLE_GAP * 2)) / 3;
    const cellSize = Math.min(maxSize, availableCellWidth);
    
    const rowHeight = cellSize + BUBBLE_ROW_GAP;
    const totalRowWidth = (3 * cellSize) + (2 * BUBBLE_GAP);
    const startX = Math.max(0, (containerWidth - totalRowWidth) / 2);

    const bubbles = options.map((option, index) => {
      const row = Math.floor(index / BUBBLES_PER_ROW);
      const col = index % BUBBLES_PER_ROW;

      const label = option.labelKey ? t(option.labelKey) : (option.label || option.id);
      const itemSize = getBubbleSize(label, minSize, cellSize);

      const rowTop = row * rowHeight;
      let cellLeft = 0;
      let cellTop = 0;

      if (col === 0) {
        cellLeft = startX;
        cellTop = rowTop;
      } else if (col === 1) {
        cellLeft = startX + cellSize + BUBBLE_GAP;
        cellTop = rowTop + (cellSize * CENTER_OFFSET_RATIO); // Center is shifted down
      } else {
        cellLeft = startX + 2 * (cellSize + BUBBLE_GAP);
        cellTop = rowTop;
      }

      // Center it within its strictly-sized cell
      const left = cellLeft + (cellSize - itemSize) / 2;
      const top = cellTop + (cellSize - itemSize) / 2;

      return {
        ...option,
        label,
        size: itemSize,
        left,
        top,
      };
    });

    const numRows = Math.ceil(options.length / BUBBLES_PER_ROW);
    // Container height accommodates the shifted middle items in the last row
    const contentHeight = (numRows * rowHeight) + (cellSize * CENTER_OFFSET_RATIO);

    return { bubbles, height: contentHeight };
  }, [options, containerWidth, t]);

  return (
    <div 
      ref={containerRef} 
      className={cn("relative w-full overflow-hidden", className)}
      style={{ minHeight: `${bubbleLayout.height}px` }}
    >
      {bubbleLayout.bubbles.map((bubble) => {
        const selected = isSelected(bubble.id);
        
        return (
          <button
            key={bubble.id}
            onClick={() => onSelect(bubble.id)}
            className="absolute flex items-center justify-center text-center transition-all duration-300"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}px`,
              top: `${bubble.top}px`,
              borderRadius: '50%',
              // Similar "Glass" style as native `GlassView`
              background: selected 
                ? 'var(--accent)'
                : 'rgba(255,255,255,0.06)',
              border: selected 
                ? '1px solid transparent'
                : '1px solid rgba(255,255,255,0.1)',
              boxShadow: selected 
                ? '0 4px 12px rgba(194, 174, 191, 0.4)'
                : 'inset 0 1px 0 rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span 
              className={cn(
                "px-2 w-full truncate-2 text-sm leading-tight",
                selected ? "font-semibold text-white" : "font-normal text-white"
              )}
              style={{
                fontSize: bubble.size < 95 ? '0.8rem' : '0.9rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              {bubble.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
