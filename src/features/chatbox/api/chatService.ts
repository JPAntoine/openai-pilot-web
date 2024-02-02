import { baseAxiosInstance } from "@/app/base-api";
import { AxiosResponse } from "axios";

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
}

export type CompleteChatResponse = {
  message: Omit<Message, "id" | "conversationId">;
}

export interface CompleteChatArgs {
  messages: Omit<Message, "id" | "conversationId">[];
  conversationId: string;
}

// API Methods
export const generateTitle = async (
  args: GenerateTitleArgs, 
  controllerSignal: AbortSignal
): Promise<GenerateTitleResponse> => {
  const response: AxiosResponse<GenerateTitleResponse> = 
    await baseAxiosInstance.post(`/conversation/${args.conversationId}/generateTitle`, {}, { signal: controllerSignal });
  return response.data;
};  

export const completeChat = async (
  args: Conversation, 
  controllerSignal: AbortSignal
): Promise<CompleteChatResponse> => {  
  const response: AxiosResponse<CompleteChatResponse> =
    await baseAxiosInstance.post("/chat", args, { signal: controllerSignal });
  return response.data;
};