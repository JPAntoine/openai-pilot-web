const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...rest
}) => {
  
  const buttonClass = `mb-1 border-none ${className || ''}`;

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};

export default SecondaryButton;