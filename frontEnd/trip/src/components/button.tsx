import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'destructive';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'default', className = '' }) => {
  const baseStyles = 'px-4 py-2 rounded text-sm font-medium';
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
