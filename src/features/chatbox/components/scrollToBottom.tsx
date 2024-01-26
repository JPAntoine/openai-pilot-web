import React, { useRef, useEffect } from 'react';

/**
 * Component that automatically scrolls to the bottom of a container
 * when the `value` prop changes. This is typically used to ensure
 * that the latest content in a chat or feed is visible.
 */
const ScrollToBottom: React.FC<{ value?: string }> = ({ value }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [value]);

  return <div ref={elementRef} />;
};

export default ScrollToBottom;
