import React from 'react';
import argtechLogo from '../assets/images/argtech-logo.png';

interface ArgtechLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function ArgtechLogo({ size = 48, showText = false, className = '' }: ArgtechLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <img 
          src={argtechLogo} 
          alt="ArgTech Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="text-left">
          <span className="font-sans font-extrabold text-white text-lg block leading-none tracking-tight uppercase">
            Argtech
          </span>
          <span className="text-[9px] font-mono text-[#A8A8A8] tracking-widest uppercase block mt-1">
            Soluções em Informática
          </span>
        </div>
      )}
    </div>
  );
}
