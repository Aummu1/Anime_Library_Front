'use client';
import React, { memo } from 'react';

// Props interface
interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

// Keyframes injected globally once
if (typeof window !== 'undefined') {
  const styleId = 'aurora-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes aurora {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-aurora {
        animation-name: aurora;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .animate-aurora { animation: none; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Main AuroraText component
const AuroraText = memo(
  ({
    children,
    className = '',
    colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundSize: '200% auto',
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className="relative animate-aurora bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = 'AuroraText';
export default AuroraText;
