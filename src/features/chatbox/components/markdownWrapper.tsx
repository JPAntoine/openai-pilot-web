import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  // Add other props as needed
}

interface StandardComponentProps {
  children?: React.ReactNode;
  // Add other standard HTML props as needed
}

export const MarkdownWrapper: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      components={{
        code({ inline, className, children, ...props }: CodeComponentProps) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={dracula}
              {...props} // Ensure these props are compatible with SyntaxHighlighter
            />
          ) : (
            <code className='font-code whitespace-pre-line' {...props}>
              {children}
            </code>
          );
        },
        ul({ children, ...props }: StandardComponentProps) {
          return <ul className='mb-2 list-inside list-disc last:mb-0' {...props}>{children}</ul>;
        },
        ol({ children, ...props }: StandardComponentProps) {
          return <ol className='mb-2 list-inside list-decimal last:mb-0' {...props}>{children}</ol>;
        },
        p({ children, ...props }: StandardComponentProps) {
          return <p className='mb-2 last:mb-0' {...props}>{children}</p>;
        },
        pre({ children, ...props }: StandardComponentProps) {
          return <pre className='mb-2 last:mb-0' {...props}>{children}</pre>;
        },
        // Add other components as needed
      }}
    />
  );
};
