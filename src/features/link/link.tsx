import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  openInNewTab?: boolean;
}

const Link: React.FC<LinkProps> = ({ children, openInNewTab, ...rest }) => {
  const linkProps = openInNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a {...linkProps} {...rest}>
      {children}
    </a>
  );
};

export default Link;
