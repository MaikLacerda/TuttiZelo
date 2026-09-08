import React from 'react';
import logoImg from '../../assets/logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const heightClasses = {
    sm: 'h-9',
    md: 'h-13',
    lg: 'h-18',
    xl: 'h-24',
  }[size] || 'h-13';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="TuttiZelo"
        className={`${heightClasses} w-auto object-contain rounded-md`}
      />
    </div>
  );
};

export default Logo;