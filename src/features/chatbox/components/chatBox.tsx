import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAccount } from "@azure/msal-react";
import ChatMessage from "./chatMessage";
import { ClipLoader } from "react-spinners";
import { RootState, AppDispatch } from "@/app/store";
import {
    generateTitleThunk,
  processChatThunk,
  setUserInput,
} from "../slices/conversationSlice";

import {
  setBackendUnavailable,
  setRetryCountdown,
  setRetryAttempt,
  setUserRetryCountdown,
  resetRetryState,
  setFinalCountdown
} from "../slices/retrySlice";
import MessageBar from "./messageBar";
import MessageStream from "./messageStream";
import { RetryTimes } from "@/app/constants";
import LegalNotification from "./legalNotification";

const LoadingConversation = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 overflow-auto px-4">
    <ClipLoader color="#FFFFFF" speedMultiplier={0.5} />
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
    pendingMessage } = useSelector((state: RootState) => state.conversation);
  const {
    backendUnavailable,
    retryCountdown,
    retryAttempt,
    userRetryCountdown,
    finalCountdown
  } = useSelector((state: RootState) => state.retry);

  useEffect(() => {
    if (
      conversation.messages.length >= 2 &&
      !conversation.titleGenerated &&
      activeConversationId
    ) {
        dispatch(generateTitleThunk({ args: { conversationId: conversation.id }, signal: controller.signal }));     
    }
  }, [conversation.messages.length, activeConversationId, conversation.titleGenerated]);

  useEffect(() => {
    if (backendUnavailable) {
      const timer = setInterval(() => {
        dispatch(setUserRetryCountdown(userRetryCountdown - 1));
        if (userRetryCountdown <= 1) {
          clearInterval(timer);
          dispatch(setBackendUnavailable(false));
          dispatch(setRetryAttempt(0));
          dispatch(setFinalCountdown(RetryTimes.FINAL_WAIT_TIME * 60));
        } else {
          handleRetryLogic();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [backendUnavailable, userRetryCountdown]);

  useEffect(() => {
    if (backendUnavailable && finalCountdown > 0) {
      const timer = setInterval(() => {
        dispatch(setFinalCountdown(finalCountdown - 1));
        if (finalCountdown <= 1) {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [backendUnavailable, finalCountdown]);


  const stopGeneration = () => {
    controller && controller.abort();
  };

  const handleSubmit = async () => {
    if (!isProcessingCompletion || userInput) {
      dispatch(processChatThunk({ args: { content: userInput, messages: conversation.messages, conversationId: activeConversationId || "" }, signal: controller.signal })); 
    }
  };

  const handleRetryLogic = () => {
    if (retryCountdown <= 0 && backendUnavailable && pendingMessage) {
      dispatch(setUserInput(pendingMessage));
      handleSubmit();
      const nextAttempt = retryAttempt + 1;
      dispatch(setRetryAttempt(nextAttempt));

      // Calculate the next delay for retry
      const nextDelay = Math.min(
        2 * RetryTimes.BASE_DELAY * Math.pow(2, nextAttempt),
        RetryTimes.MAX_RETRY_DURATION
      );
      dispatch(setRetryCountdown(nextDelay));

      if (nextDelay >= RetryTimes.MAX_RETRY_DURATION) {
        dispatch(resetRetryState());
      }
    }
  };

  return (
    <div className="flex h-full max-h-full w-full flex-col gap-4 rounded-xl">
      {/* if activeConvoId is null, show the intro state (welcome message) which is a static UI and pass greeting to messageStream */}
      {activeConversationId === null ||
      !conversation.messages.length ? (
        <div className="flex flex-col h-full overflow-auto">
          <LegalNotification className="w-4/5 mt-16 self-center rounded-3xl" />
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
              <div className="text-white font-bold italic">
                System appears to be unavailable, automatically retrying for{" "}
                {userRetryCountdown} seconds...
              </div>
            ) : (
              <div className="text-white font-bold italic">
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
