import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAccount } from "@azure/msal-react";
import ChatMessage from "./chatMessage";
import { ClipLoader } from "react-spinners";
import { RootState, AppDispatch } from "@/app/store";
import {
  completeChatThunk,
  generateTitleThunk,
  setUserInput,
} from "../slices/conversationSlice";

import MessageBar from "./messageBar";
import MessageStream from "./messageStream";
import { RetryTimes } from "@/app/constants";
import LegalNotification from "./legalNotification";

const LoadingConversation = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 overflow-auto px-4">
    <ClipLoader className="loader-primary" speedMultiplier={0.5} />
  </div>
);

const ChatBox: React.FC<object> = () => {
    const dispatch: AppDispatch = useDispatch();
  const user = useAccount();
  
  const controller = new AbortController();  
  const { 
    userInput, 
    activeConversationId, 
    isProcessingCompletion, 
    conversation, 
    hasError, 
    isLoading, 
    } = useSelector((state: RootState) => state.conversation);
  const {
    backendUnavailable,
    userRetryCountdown,
  } = useSelector((state: RootState) => state.retry);

  useEffect(() => {
    if (
      conversation.messages.length >= 2 &&
      !conversation.title &&
      activeConversationId
    ) {
        dispatch(generateTitleThunk({ args: { conversationId: activeConversationId}, signal: controller.signal }));     
    }
  }, [conversation.messages.length, activeConversationId, conversation.title]);

  const stopGeneration = () => {
    controller && controller.abort();
  };

  const handleSubmit = async () => {
    if (!isProcessingCompletion || userInput) {      
      dispatch(completeChatThunk({ signal: controller.signal })); 
    }
  };

  return (
    <div className="flex h-full max-h-full w-full flex-col gap-4 bg-secondary rounded-xl">
      {/* if activeConvoId is null, show the intro state (welcome message) which is a static UI and pass greeting to messageStream */}
      {activeConversationId === null ||
      !conversation.messages.length ? (
        <div className="flex flex-col h-full overflow-auto">
          <LegalNotification className="w-4/5 mt-16 self-center bg-background rounded-3xl bg-" />
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
          isError={hasError}
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
                again in {RetryTimes.FINAL_WAIT_TIME} minutes.
              </div>
            )}
          </div>
        </div>
      )}
      <MessageBar
        value={userRetryCountdown > 0 ? "" : userInput}
        setValue={(value) => dispatch(setUserInput(value))}
        onSubmit={handleSubmit}
        stopGeneration={stopGeneration}
      />
    </div>
  );
};

export default ChatBox;
