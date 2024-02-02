import { RootState } from "@/app/store";
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
  'conversation/completeChat',
  async ({ signal }: { signal: AbortSignal }, { getState }) => {
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
    return await api.completeChat(payload, signal);      
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
    .addCase(generateTitleThunk.fulfilled, (state, action) => {
      state.conversation.title = action.payload.title;
    })
    // complete Chat
    .addCase(completeChatThunk.pending, (state) => {
      state.isLoading = true;
      state.isProcessingCompletion = true;
      state.hasError = false;
      state.inFlightMessage = state.userInput;
      state.pendingMessage = state.userInput;
      state.userInput = "";
    })
    .addCase(completeChatThunk.fulfilled, (state, action) => {
      // push the users message to the conversation
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

