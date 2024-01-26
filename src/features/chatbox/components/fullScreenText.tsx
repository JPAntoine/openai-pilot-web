import React from 'react';
import { ClipLoader } from 'react-spinners';

interface FullScreenTextProps {
  children: React.ReactNode;
  showSpinner?: boolean;
}

const FullScreenText: React.FC<FullScreenTextProps> = ({
  children,
  showSpinner = false, // Default value for optional prop
}) => {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-black text-white font-sans text-4xl font-bold gap-4">
      {showSpinner && (
        <ClipLoader
          color="#FFFFFF"
          size={64} // Using size instead of w-16 h-16 for consistency
          speedMultiplier={0.5}
        />
      )}
      {children}
    </div>
  );
};

export default FullScreenText;
