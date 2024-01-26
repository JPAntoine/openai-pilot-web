import React from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className, ...rest }) => {
  // Construct the class name string
  const headerClass = `w-full ${className || ''}`;

  return (
    <div className={headerClass} {...rest}>
      {children}
    </div>
  );
};

export default Header;
