import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import ScrollToBottom from './scrollToBottom';
import ChatMessage from './chatMessage';
import { Message } from '../api/chatService';

interface MessageStreamProps {
  messages: Array<Message>;
  isError: boolean;
  isLoading: boolean;
}

const MessageStream: React.FC<React.HTMLAttributes<HTMLElement> & MessageStreamProps> = ({
  messages, isError, isLoading, ...rest
}) => {
  const inFlightMessage = useSelector((state: RootState) => state.conversation.inFlightMessage);
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden hover:overflow-auto px-4 bg-background" {...rest}>
      {messages?.map((message: Message) => (
        <ChatMessage message={message} key={message.id} />
      ))}
  
      {inFlightMessage && (
        <>
          {inFlightMessage && (
            <ChatMessage
              message={{ id: "inTransit", role: "user", content: inFlightMessage }}
            />
          )}
  
          {isLoading && (
            <ChatMessage
              message={{ id: "thinking", role: "assistant", content: "I'm thinking..." }}
            />
          )}
        </>
      )}
  
      {isError && (
        <ChatMessage
          message={{ id: "error", role: "assistant", content: "Sorry, I'm having trouble answering that question." }}
        />
      )}
      <ScrollToBottom value={messages?.slice(-1)[0]?.id} />
    </div>
  );
};

export default MessageStream;
