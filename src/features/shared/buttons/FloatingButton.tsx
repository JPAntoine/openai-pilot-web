import React from "react";
import { useFloating } from "@floating-ui/react";
import SecondaryButton from "./SecondaryButton";

interface FloatingButtonProps {
  anchor: HTMLDivElement | null;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  anchor,
  onClick,
  children,
  className,
}) => {
  const { refs, floatingStyles } = useFloating({
    elements: {
      reference: anchor,
    },
    placement: "top",
  });

  const buttonClass = `border-none !bg-sce-grey-100 !text-sce-grey-700 !rounded-full px-6 h-[2.375rem] ${className || ''}`;

  return (
    <div ref={refs.setFloating} style={floatingStyles}>
      <SecondaryButton onClick={onClick} className={buttonClass}>
        {children}
      </SecondaryButton>
    </div>
  );
};

export default FloatingButton;
