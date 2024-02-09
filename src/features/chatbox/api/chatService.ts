import { AppDispatch } from "@/app/store";
import { executeApiRequest } from "@/app/StatefulHttpRequestHandler";
import { CancelToken } from "axios";

// Common Types
export type User = {
  id: string;
  email: string;
};

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export interface Citation {
  id: string;
  fileName: string;
  url: string;
  startPage: number;
  endPage: number;
  content: string;
  container: string;
}

export interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  conversationId: string;
  citations?: Citation[];
  createdAt?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Array<Message>;
  user: User;
}

// Response and Argument Types
export interface GenerateTitleArgs {
  conversationId: string;
}

export interface GenerateTitleResponse {
  title: string;
  conversationId: string;
}

export type CompleteChatResponse = {
  message: Omit<Message, "id" | "conversationId">;
  conversationId: string;
};

export interface CompleteChatArgs {
  messages: Omit<Message, "id" | "conversationId">[];
  conversationId: string;
}

// API Methods
export const generateTitleApiEndpoint = "/conversation/:conversationId/generateTitle";
export const generateTitle = async (
  args: GenerateTitleArgs,
  cancelToken: CancelToken,
  dispatch: AppDispatch
): Promise<GenerateTitleResponse> => {
  return executeApiRequest<GenerateTitleArgs, GenerateTitleResponse>({
    args,
    cancelToken,
    dispatch,
    url: generateTitleApiEndpoint,
  });
};

export const completeChatApiEndpoint = "/chat";
export const completeChat = async (
  args: CompleteChatArgs,
  cancelToken: CancelToken,
  dispatch: AppDispatch
): Promise<CompleteChatResponse> => {
  return executeApiRequest<CompleteChatArgs, CompleteChatResponse>({
    args,
    cancelToken,
    dispatch,
    url: completeChatApiEndpoint,
  });
};


