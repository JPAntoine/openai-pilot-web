import { AppDispatch, RootState } from "@/app/store";
import {
  Conversation,
  GenerateTitleArgs,
  Message,
} from "@/features/chatbox/api/chatService";

import * as api from "@/features/chatbox/api/chatService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CancelToken } from "axios";

// Async thunks
export const generateTitleThunk = createAsyncThunk(
  "conversation/generateTitle",
  async ({
    args,
    cancelToken,
    dispatch,
  }: {
    args: GenerateTitleArgs;
    cancelToken: CancelToken;
    dispatch: AppDispatch;
  }) => {
    return await api.generateTitle(args, cancelToken, dispatch);
  }
);

export const completeChatThunk = createAsyncThunk(
  'conversation/completeChat',
  async ({ cancelToken, dispatch }: { cancelToken: CancelToken, dispatch: AppDispatch }, { getState }) => {
    const state = getState() as RootState; 
    const conversationState = state.conversation;
    const newMsg: Message = {
      content: conversationState.inFlightMessage,
      role: "user",
      id: "",
      conversationId: "",
      createdAt: "",
    };

    const payload: api.CompleteChatArgs = {
      messages: [...conversationState.conversation.messages, newMsg],
      conversationId: conversationState.activeConversationId || Math.random().toString(36).substring(7),
    };
    return await api.completeChat(payload, cancelToken, dispatch);      
  }
);

export interface ConversationState {
  activeConversationId: string;
  isProcessingCompletion: boolean;
  inFlightMessage: string;
  pendingMessage: string;
  hasCompletionError: boolean;
  isLoading: boolean;
  conversation: Conversation;
  userInput: string;
  conversations: Conversation[];
}

export const initialState: ConversationState = {
  activeConversationId: "",
  isProcessingCompletion: false,
  inFlightMessage: "",
  pendingMessage: "",
  hasCompletionError: false,
  isLoading: false,
  userInput: "",
  conversation: {
    id: "",
    title: "",
    messages: [],
    user: { id: "", email: "" },
  },
  conversations: []
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      if(action.payload === null) {
        state.conversation = initialState.conversation;
        state.userInput = "";
      }
      else {
        const conversation = state.conversations.find(c => c.id === action.payload);
        if(conversation) {
          state.conversation = conversation;
        }
      }
      state.activeConversationId = action.payload || "";
    },
    setIsProcessingCompletion: (state, action: PayloadAction<boolean>) => {
      state.isProcessingCompletion = action.payload;
    },
    setInFlightMessage: (state, action: PayloadAction<string>) => {
      state.inFlightMessage = action.payload;
    },
    setHasCompletionError: (state) => {
      state.hasCompletionError = true;
    },
    setUserInput: (state, action: PayloadAction<string>) => {
      state.userInput = action.payload;
    },
    setPendingMessage: (state, action: PayloadAction<string>) => {
      state.pendingMessage = action.payload;
    },
    setReadyState: (state) => {
        state.inFlightMessage = "",
        state.pendingMessage = "",
        state.isLoading = false,
        state.isProcessingCompletion = false
    }
  },
  extraReducers: (builder) => {
    builder
    // Generate Title
    .addCase(generateTitleThunk.fulfilled, (state, action) => {
      state.conversation.title = action.payload.title;
      updateConversations(state);
    })
    // complete Chat
    .addCase(completeChatThunk.pending, (state) => {
      state.isLoading = true;
      state.isProcessingCompletion = true;
      state.inFlightMessage = state.userInput;
      state.pendingMessage = state.userInput;
      state.userInput = "";
      if (state.hasCompletionError) {
        state.conversation.messages.pop();
      }
    })
    .addCase(completeChatThunk.fulfilled, (state, action) => {
      state.activeConversationId = action.payload.conversationId;
      state.hasCompletionError = false;
      //push the users message to the conversation
      state.conversation.messages.push({
        content: state.inFlightMessage,
        role: "user",
        id: state.conversation.messages.length.toString(), 
        conversationId: state.activeConversationId, 
        createdAt: new Date().toISOString(),
      });
      // push the bots message to the conversation
      state.conversation.messages.push({
        ...action.payload.message,
        id: state.conversation.messages.length.toString(),
        conversationId: state.activeConversationId,
      });

      //update conversation state
      state.conversation.id = state.activeConversationId;
      state.conversation.user = { id: "1", email: "" }; //TODO need to update this from the actual user object when that is in place
      state.activeConversationId = action.payload.conversationId
      updateConversations(state);
      
      //reset state
      Object.assign(state, {
        inFlightMessage: "",
        pendingMessage: "",
        isLoading: false,
        isProcessingCompletion: false,
        activeConversationId: action.payload.conversationId,
      });    
    })
    .addCase(completeChatThunk.rejected, (state) => {
      state.isLoading = false;
      state.hasCompletionError = true;
      state.isProcessingCompletion = false;
      state.inFlightMessage = "";
      state.userInput = state.pendingMessage;
    });
  },
});

export const {
  setActiveConversationId,
  setIsProcessingCompletion,
  setInFlightMessage,
  setHasCompletionError,
  setUserInput,
  setPendingMessage,
  setReadyState
} = conversationSlice.actions;

export default conversationSlice.reducer;


export const updateConversations = (state: ConversationState) => {
  const index = state.conversations.findIndex(c => c.id === state.conversation.id);

  if (index !== -1) {
    // Conversation with the same ID exists, overwrite it
    state.conversations[index] = state.conversation;
  } else {
    // No conversation with the same ID, add the new one
    state.conversations.push(state.conversation);
  }
};

