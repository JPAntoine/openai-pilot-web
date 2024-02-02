import React from 'react';

interface ConversationHistoryProps {
    name: string;
    conversationID: string;
    selected?: boolean;
  }
  
export const ConversationHistoryItem: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & ConversationHistoryProps
  > = ({
    className,
    name,
    conversationID,
    selected,
    ...rest
  }) => {
  
    return (
        <div>            
            <button
                className={`flex items-center gap-2 p-4 w-full text-left text-black hover:primary ${
                    selected ? "bg-secondary" : ""
                } ${className || ""}`}
                {...rest}
            >
                <div className="flex-1">{name}</div>
                <div className="text-text-secondary">{conversationID}</div>
            </button>         
            <div className="border-t border-primary mx-4 "></div>  
  
        </div>
    )
}
