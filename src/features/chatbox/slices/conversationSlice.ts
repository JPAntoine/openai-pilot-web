import {
  Conversation,
  GenerateTitleArgs,
  Message,
} from "@/features/chatbox/api/chatService";

import * as api from "@/features/chatbox/api/chatService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Async thunks
export const generateTitleThunk = createAsyncThunk(
  "conversation/generateTitle",
  async ({
    args,
    signal,
  }: {
    args: GenerateTitleArgs;
    signal: AbortSignal;
  }) => {
    return await api.generateTitle(args, signal);
  }
);

export const completeChatThunk = createAsyncThunk(
  'conversation/processChat',
  async ({ args, signal }: { args: Conversation; signal: AbortSignal }) => {
    return await api.completeChat(args, signal);      
  }
);

interface ConversationState {
  activeConversationId: string;
  isProcessingCompletion: boolean;
  inFlightMessage: string;
  pendingMessage: string;
  hasError: boolean;
  isLoading: boolean;
  conversation: Conversation;
  userInput: string;
  conversations: Conversation[];
}

const initialState: ConversationState = {
  activeConversationId: "",
  isProcessingCompletion: false,
  inFlightMessage: "",
  pendingMessage: "",
  hasError: false,
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
      state.activeConversationId = action.payload || "";
    },
    setIsProcessingCompletion: (state, action: PayloadAction<boolean>) => {
      state.isProcessingCompletion = action.payload;
    },
    setInFlightMessage: (state, action: PayloadAction<string>) => {
      state.inFlightMessage = action.payload;
    },
    setHasError: (state, action: PayloadAction<boolean>) => {
      state.hasError = action.payload;
    },
    setUserInput: (state, action: PayloadAction<string>) => {
      state.userInput = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    // Generate Title
    .addCase(generateTitleThunk.pending, (state) => {
      //state.isLoading = true;
      //state.hasError = false;
    })
    .addCase(generateTitleThunk.fulfilled, (state, action) => {
      //state.isLoading = false;
      state.conversation.title = action.payload.title;
    })
    .addCase(generateTitleThunk.rejected, (state) => {
      //state.isLoading = false;
      //state.hasError = true;
    })
    // complete Chat
    .addCase(completeChatThunk.pending, (state) => {
      state.isLoading = true;
      state.isProcessingCompletion = true;
      state.hasError = false;
      state.inFlightMessage = state.userInput;
      state.pendingMessage = state.userInput;
      state.userInput = "";
      state.activeConversationId = state.activeConversationId || Math.random().toString(36).substring(7);
    })
    .addCase(completeChatThunk.fulfilled, (state, action) => {
      // need to push the users message to the conversation
      const newUserMessage: Message = {
        content: state.inFlightMessage,
        role: "user",
        id: state.conversation.messages.length.toString(), 
        conversationId: state.activeConversationId, 
        createdAt: new Date().toISOString(),
      };
      state.conversation.messages.push(newUserMessage);
      //need to push the bots message to the conversation
      const newMessage = {
        ...action.payload.message,
        id: state.conversation.messages.length.toString(), // Assign the next ID for UL 
        conversationId: state.activeConversationId || "", // Assuming this is the relevant conversation ID bun need to check for nulls.
      };
      state.conversation.messages.push(newMessage);
      state.inFlightMessage = "";
      state.pendingMessage = "";
      updateConversations(state);
      state.isLoading = false;
      state.isProcessingCompletion = false;
    })
    .addCase(completeChatThunk.rejected, (state) => {
      state.isLoading = false;
      state.hasError = true;
    });
  },
});

export const {
  setActiveConversationId,
  setIsProcessingCompletion,
  setInFlightMessage,
  setHasError,
  setUserInput
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