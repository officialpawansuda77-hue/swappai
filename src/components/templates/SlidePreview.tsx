import { useState, useEffect, useRef } from 'react';
import { Slide, CanvasElement, TextProperties, ShapeProperties, ImageProperties } from '../../types';

interface SlidePreviewProps {
  slide: Slide;
  scale?: number;
  autoScale?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isSelected?: boolean;
}

function renderElement(el: CanvasElement, scale: number) {
  if (!el.visible) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: el.x * scale,
    top: el.y * scale,
    width: el.width * scale,
    height: el.height * scale,
    transform: `rotate(${el.rotation}deg)`,
    opacity: el.opacity,
    zIndex: el.zIndex,
    pointerEvents: 'none',
    userSelect: 'none',
  };

  if (el.type === 'text') {
    const props = el.properties as TextProperties;
    return (
      <div
        key={el.id}
        style={{
          ...style,
          fontFamily: props.fontFamily || 'Inter',
          fontSize: props.fontSize * scale,
          fontWeight: props.fontWeight || 400,
          color: props.color || '#111111',
          textAlign: props.alignment || 'left',
          letterSpacing: `${(props.letterSpacing || 0) * scale}px`,
          lineHeight: props.lineHeight || 1.3,
          textTransform: props.textCase === 'uppercase' ? 'uppercase' : props.textCase === 'lowercase' ? 'lowercase' : 'none',
          textDecoration: props.textDecoration === 'underline' ? 'underline' : 'none',
          fontStyle: props.fontStyle === 'italic' ? 'italic' : 'normal',
          ...(props.strokeColor && props.strokeWidth
            ? { WebkitTextStroke: `${props.strokeWidth * scale}px ${props.strokeColor}`, paintOrder: 'stroke fill' }
            : {}),
          display: 'block',
          overflow: 'hidden',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {props.text}
      </div>
    );
  }

  if (el.type === 'shape') {
    const props = el.properties as ShapeProperties;
    const shapeStyle: React.CSSProperties = {
      ...style,
      background: props.fill || '#111111',
      border: props.stroke ? `${(props.strokeWidth || 1) * scale}px solid ${props.stroke}` : 'none',
      borderRadius:
        props.shapeType === 'circle'
          ? '50%'
          : props.shapeType === 'line'
          ? '0'
          : props.borderRadius
          ? `${props.borderRadius * scale}px`
          : '0',
    };
    return <div key={el.id} style={shapeStyle} />;
  }

  if (el.type === 'image') {
    const props = el.properties as ImageProperties;
    return (
      <div key={el.id} style={{ ...style, overflow: 'hidden', borderRadius: props.borderRadius ? `${props.borderRadius * scale}px` : 0 }}>
        {props.src ? (
          <img
            src={props.src}
            alt={props.alt || ''}
            style={{ width: '100%', height: '100%', objectFit: props.objectFit || 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(17,17,17,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10 * scale, color: '#6B6B67' }}>Image</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function SlidePreview({
  slide,
  scale: propScale,
  autoScale = false,
  className = '',
  style,
  onClick,
  isSelected = false,
}: SlidePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideWidth = slide?.width || 1080;
  const slideHeight = slide?.height || 1350;

  const [measuredScale, setMeasuredScale] = useState<number>(() => {
    if (!autoScale && propScale !== undefined) return propScale;
    return 280 / slideWidth;
  });

  useEffect(() => {
    if (!autoScale && propScale !== undefined) {
      setMeasuredScale(propScale);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const w = node.clientWidth || node.getBoundingClientRect().width;
      if (w > 0 && slideWidth > 0) {
        setMeasuredScale(w / slideWidth);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, [autoScale, propScale, slideWidth]);

  const effectiveScale = (!autoScale && propScale !== undefined) ? propScale : measuredScale;

  const bg = slide?.background || { type: 'solid', value: '#111111' };
  const bgStyle: React.CSSProperties =
    bg.type === 'solid'
      ? (bg.value.includes('gradient')
          ? { background: bg.value }
          : { backgroundColor: bg.value })
      : { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };

  const sortedElements = [...(slide?.elements || [])].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden flex-shrink-0 ${isSelected ? 'ring-2 ring-[#FF5A00]' : ''} ${className}`}
      style={{
        width: autoScale ? '100%' : (slideWidth * effectiveScale),
        height: autoScale ? '100%' : (slideHeight * effectiveScale),
        ...bgStyle,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {sortedElements.map(el => renderElement(el, effectiveScale))}
    </div>
  );
}

