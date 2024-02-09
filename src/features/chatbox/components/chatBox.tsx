import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAccount } from "@azure/msal-react";
import ChatMessage from "./chatMessage";
import { ClipLoader } from "react-spinners";
import { RootState, AppDispatch } from "@/app/store";
import {
  completeChatThunk,
  generateTitleThunk,
  setPendingMessage,
  setUserInput,
} from "../slices/conversationSlice";

import MessageBar from "./messageBar";
import MessageStream from "./messageStream";
import axios, { CancelTokenSource } from "axios";

const LoadingConversation = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 overflow-auto px-4">
    <ClipLoader className="loader-primary" speedMultiplier={0.5} />
  </div>
);

const ChatBox: React.FC<object> = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useAccount();  
  const [completeChatCancelTokenSource, setCompleteChatCancelTokenSource] = useState<CancelTokenSource | null>(null);
  const [generateTitleCancelTokenSource, setGenerateTitleCancelTokenSource] = useState<CancelTokenSource | null>(null);
  const { 
    userInput, 
    activeConversationId, 
    isProcessingCompletion, 
    conversation, 
    hasCompletionError, 
    isLoading, 
    pendingMessage,
    inFlightMessage
    } = useSelector((state: RootState) => state.conversation);
  const {
    backendUnavailable,
    userRetryCountdown,
    finalCountdown,
  } = useSelector((state: RootState) => state.retry);
  
  useEffect(() => {
    if (
      conversation.messages.length >= 2 &&
      !conversation.title &&
      activeConversationId
    ) {

        const source = axios.CancelToken.source();
        setGenerateTitleCancelTokenSource(source); 
        dispatch(generateTitleThunk({ args: { conversationId: activeConversationId}, cancelToken: source.token, dispatch: dispatch}));     
    }
  }, [conversation.messages.length, activeConversationId, conversation.title]);

  useEffect(() => {
    if (backendUnavailable && !pendingMessage){
      dispatch(setPendingMessage(inFlightMessage));
    } else if (!backendUnavailable && pendingMessage){
      dispatch(setPendingMessage(""));
    }
  }, [backendUnavailable]);

  const handleSubmit = async () => {
    if (!isProcessingCompletion && userInput) {  
      const source = axios.CancelToken.source();
      setCompleteChatCancelTokenSource(source); 
      dispatch(completeChatThunk({ cancelToken: source.token, dispatch: dispatch})); 
    }
  };

  const stopGeneration = () => {
    if (completeChatCancelTokenSource) {
      completeChatCancelTokenSource.cancel("Operation canceled by the user.");
      setCompleteChatCancelTokenSource(null);
    }
    if (generateTitleCancelTokenSource) {
      generateTitleCancelTokenSource.cancel("Operation canceled by the user.");
      setGenerateTitleCancelTokenSource(null);
    }
  };
  
  return (
    <div className="flex h-full max-h-full w-full flex-col gap-4 bg-background rounded-xl">
      {/* if activeConvoId is null, show the intro state (welcome message) which is a static UI and pass greeting to messageStream */}
      {activeConversationId === "" && !backendUnavailable ? (
        <div className="flex flex-col h-full overflow-auto">
          <ChatMessage
            className="mt-auto"
            message={{
              id: "intro",
              role: "assistant",
              content: `Hi there ${
                user?.name?.split(" ")[0]
              }! I'm a chatbot powered by GPT-3.5. You can ask me anything you'd like, and I'll do my best to provide a helpful response.`,
            }}
          />
        </div>
      ) : conversation ? (
        <MessageStream
          isError={hasCompletionError}
          isLoading={isLoading}
          messages={conversation.messages}
        />
      ) : (
        <LoadingConversation />
      )}
      {backendUnavailable && (
        <div className="flex flex-col justify-center mb-[-4px]">
          <div className="text-center">
            {userRetryCountdown > 0 ? (
              <div className="font-bold italic">
                System appears to be unavailable, automatically retrying for{" "}
                {userRetryCountdown} seconds...
              </div>
            ) : (
              <div className="font-bold italic">
                System is currently unavailable. Please enter your question
                again in { Math.floor(finalCountdown/60) } minutes.
              </div>
            )}
          </div>
        </div>
      )}
      <MessageBar
        value={userRetryCountdown > 0 ? "" : userInput}
        setValue={(value) => !isProcessingCompletion ? dispatch(setUserInput(value)) : null}
        onSubmit={handleSubmit}
        stopGeneration={stopGeneration}
      />
    </div>
  );
};

export default ChatBox;