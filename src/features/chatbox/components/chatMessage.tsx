import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import UserIcon from '../../userIcon/userIcon';
import { MarkdownWrapper } from './markdownWrapper';
import { Message } from '../api/chatService';

interface ChatMessageProps {
  message: Omit<Message, 'conversationId'>;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, className }) => {  
    const messageClasses = `flex h-fit min-w-0 items-center gap-4 px-8 py-3 text-text-primary first:mt-auto ${
      message.role === "user" ? "bg-background rounded-md" : ""
    } ${className || ""}`;
  
    const renderAvatar = () => (
      <div className="h-10 w-10 flex-shrink-0 self-start flex items-center rounded-md bg-White overflow-hidden">
        {message.role === "assistant" ? (
          <img src="DTE-primary.png" alt="bot avatar" />
        ) : (
          <UserIcon className="h-10 w-10" />
        )}
      </div>
    );
  
    return (
      <div className={messageClasses} key={message.id}>
        {renderAvatar()}
        <div className="min-w-0 break-words">
          {message.id === "thinking" ? (
            <PulseLoader className="loader-primary" size={5} loading />
          ) : (
            <>
              <MarkdownWrapper content={message.content} />              
            </>
          )}
        </div>
      </div>
    );
};
  
export default ChatMessage;