import React from 'react';

export const PrimaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...rest }) => {
    const buttonClass = `bg-accent-1 w-full rounded-full text-white transition-colors duration-300 hover:bg-primary ${className}`;

  return (
    <button
      className={buttonClass}
      {...rest}
    >
      {children}
    </button>
  );
};
