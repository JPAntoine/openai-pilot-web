// MessageBar.tsx
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { PulseLoader } from 'react-spinners';
import UserIcon from '@/features/userIcon/userIcon';
import { PaperPlane } from '@/icons';
import FloatingButton from '@/features/shared/buttons/FloatingButton';
import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
interface MessageBarProps {
  onSubmit: () => void;
  value: string;
  setValue: (x: string) => void;
  stopGeneration?: () => void;
}

const MessageBar: React.FC<MessageBarProps> = ({
  onSubmit,
  value,
  setValue,
  stopGeneration,
}) => {
  const { isProcessingCompletion, userRetryCountdown } = useSelector((state: RootState) => ({
    isProcessingCompletion: state.conversation.isProcessingCompletion,
    userRetryCountdown: state.retry.userRetryCountdown, // Assuming `retry` slice exists
  }));
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className="bg-secondary flex w-full items-center gap-2 rounded-md px-8 py-2 mt-auto shadow-custom"
      ref={setAnchor}
    >
      <div>
        <UserIcon className="h-8 w-8" />
      </div>
      {isProcessingCompletion && userRetryCountdown === 0 && (
        <FloatingButton
          anchor={anchor}
          onClick={() => stopGeneration && stopGeneration()}
        >
          <span className="px-2 text-[1.0625rem] leading-5 font-sf font-bold text-text-primary">
            Stop Generating
          </span>
        </FloatingButton>
      )}
      <TextareaAutosize
        maxRows={8}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask your question..."
        className="h-full w-full flex-grow resize-none bg-transparent p-2 text-black outline-none"
        disabled={userRetryCountdown > 0}
      />
      {isProcessingCompletion || userRetryCountdown > 0 ? (
        <div className="flex h-12 max-w-min items-center justify-center gap-1 border-none p-2">
          <PulseLoader size={4} color="#F4F5F7" loading={true} />
        </div>
      ) : (
        <>          
          <button
            className="flex max-w-min items-center justify-center gap-1 border-none p-2 text-sm h-12 w-full rounded-lg border border-text-primary text-text-primary transition-colors duration-300 disabled:border-gray-500 disabled:text-gray-500"
            onClick={onSubmit}
            disabled={userRetryCountdown > 0 || isProcessingCompletion}
          >
            <div className="text-sm">Send</div>
            <PaperPlane className="ml-1 h-4 w-4" />
          </button>
        </>
      )}    
    </div>
  );
};


export default MessageBar;