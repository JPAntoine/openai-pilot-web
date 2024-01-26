import {
  CompleteChatArgs,
  GenerateTitleArgs,
  PostMessageArgs,
  Conversation,
  ProcessChatArgs,
} from "@/features/chatbox/api/chatService";

import * as api from "@/features/chatbox/api/chatService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Async thunks
export const completeChatThunk = createAsyncThunk(
  "conversation/completeChat",
  async ({
    args,
    signal,
  }: {
    args: CompleteChatArgs;
    signal: AbortSignal;
  }) => {
    return await api.completeChat(args, signal);
  }
);

export const generateTitleThunk = createAsyncThunk(
  "conversation/generateTitle",
  async ({
    args,
    signal,
  }: {
    args: GenerateTitleArgs;
    signal: AbortSignal;
  }) => {
    await api.generateTitle(args, signal);
  }
);

export const postConversationThunk = createAsyncThunk(
  "conversation/postConversation",
  async ({ signal, greeting }: { signal: AbortSignal, greeting?: string;  }) => {
    return await api.postConversation(signal, greeting);
  }
);

export const postMessageThunk = createAsyncThunk(
  "conversation/postMessage",
  async ({ args, signal }: { args: PostMessageArgs; signal: AbortSignal }) => {
    return await api.postMessage(args, signal);
  }
);

export const processChatThunk = createAsyncThunk(
    'conversation/processChat',
    async ({ args, signal }: { args: ProcessChatArgs; signal: AbortSignal }) => {
      return await api.processChat(args, signal);      
    }
);


interface ConversationState {
  activeConversationId: string | null;
  isProcessingCompletion: boolean;
  inFlightMessage: string;
  pendingMessage: string;
  hasError: boolean;
  isLoading: boolean;
  conversation: Conversation;
  userInput: string;
}

const initialState: ConversationState = {
  activeConversationId: null,
  isProcessingCompletion: false,
  inFlightMessage: "",
  pendingMessage: "",
  hasError: false,
  isLoading: false,
  userInput: "",
  conversation: {
    id: "",
    name: "",
    messages: [],
    titleGenerated: false,
    user: { id: "", email: "" },
  },
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
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
      // Complete Chat
      .addCase(completeChatThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(completeChatThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isProcessingCompletion = false;
      })
      .addCase(completeChatThunk.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // Generate Title
      .addCase(generateTitleThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateTitleThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.conversation.titleGenerated = true;
      })
      .addCase(generateTitleThunk.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })

      // Post Conversation
      .addCase(postConversationThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postConversationThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversation.id = action.payload.conversation.id;
      })
      .addCase(postConversationThunk.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // Post Message
      .addCase(postMessageThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversation.messages.push(action.payload.message);
      })
      .addCase(postMessageThunk.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      })
      // Process Chat
      .addCase(processChatThunk.pending, (state) => {
        state.isLoading = true;
        state.isProcessingCompletion = true;
        state.hasError = false;
        state.inFlightMessage = state.userInput;
        state.pendingMessage = state.userInput;
        state.userInput = "";
      })
      .addCase(processChatThunk.fulfilled, (state, action) => {
        const newMessage = {
          ...action.payload.result.message,
          id: state.conversation.messages.length.toString(), // Assign the next ID
          conversationId: action.payload.conversationId, // Assuming this is the relevant ID
          createdAt: new Date().toISOString(), // Assign the current date or get from another source
          updatedAt: new Date().toISOString() // Assign the current date or get from another source
        };
        state.conversation.messages.push(newMessage);
        state.conversation.id = action.payload.conversationId;
        state.activeConversationId = action.payload.conversationId;
        

        state.inFlightMessage = "";
        state.pendingMessage = "";
        state.isLoading = false;
        state.isProcessingCompletion = false;

      })
      .addCase(processChatThunk.rejected, (state) => {
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
