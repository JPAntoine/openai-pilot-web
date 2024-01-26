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
}

export interface Conversation {
  id: string;
  name: string;
  messages: Array<Message & Timestamps>;
  user: User;
  titleGenerated: boolean;
}

// Response and Argument Types
export type GetConversationResponse = {
    conversation: {
      id: string;
      name: string;
      messages: Array<Message & Timestamps>;
      user: User & Timestamps;
      titleGenerated: boolean;
    };
};

export type CompleteChatResponse = {
  message: Omit<Message, "id" | "conversationId">;
};

export type GetConversationsResponse = {
  conversations: (Omit<Conversation, "messages"> & Timestamps)[];
};

export type GetPdfResponse = {
  url: string;
};

export type PostConversationResponse = {
  conversation: Omit<Conversation, "messages"> & { user: User & Timestamps };
};

export type PostMessageResponse = {
  message: Message & Timestamps;
};

export interface PostMessageArgs {
  message: Omit<Message, "id" | "conversationId">;
  conversationId: string;
}

export interface RenameConversationArgs {
  conversationId: string;
  conversationName: string;
}

export interface UploadFileArgs {
  conversationId: string;
  form: FormData;
  fileName: string;
}

export interface CompleteChatArgs {
  messages: Omit<Message, "id" | "conversationId">[];
  conversationId: string;
}

export interface ArchiveConversationArgs {
  conversationId: string;
}

export interface GenerateTitleArgs {
  conversationId: string;
}

export interface ProcessChatArgs {
    content: string;
    messages: Message[];
    conversationId: string;
  }

// API Methods
export const completeChat = async (
  args: CompleteChatArgs, 
  controllerSignal: AbortSignal
): Promise<CompleteChatResponse> => {
  const response: AxiosResponse<CompleteChatResponse> =
    await baseAxiosInstance.post("/chat", args, { signal: controllerSignal });
  return response.data;
};

export const generateTitle = async (args: GenerateTitleArgs, controllerSignal: AbortSignal): Promise<void> => {
  await baseAxiosInstance.put(`/conversation/${args.conversationId}/generateTitle`, {}, {
    signal: controllerSignal,
  });
};  
 
export const postConversation = async (
    controllerSignal: AbortSignal,
    greeting?: string
  ): Promise<PostConversationResponse> => {
    const response = await baseAxiosInstance.post("/conversation", greeting ? { greeting: { content: greeting } } : {}, {
      signal: controllerSignal,
    });
  return response.data;
};
  
export const postMessage = async (
    args: PostMessageArgs,
    controllerSignal: AbortSignal
  ): Promise<PostMessageResponse> => {
    const response = await baseAxiosInstance.post(`/conversation/${args.conversationId}/message`, { message: args.message }, {
      signal: controllerSignal,
    });
  return response.data;
};  
  
export const processChat = async (args: ProcessChatArgs, controllerSignal: AbortSignal) => {
    const { content, conversationId: providedConversationId } = args;
    // If a conversation ID is not provided, create a new conversation and use its ID
    const conversationId = providedConversationId || (await postConversation(controllerSignal)).conversation.id;

    // Send the user's message and get the response from the chat processing backend
    const result = await completeChat({
      messages: [...args.messages, { role: "user", content: content }],
      conversationId,
    }, controllerSignal);

    // Post the user's message to the conversation
    await postMessage({
      message: { role: "user", content },
      conversationId,
    }, controllerSignal);

    // Post the generated response to the conversation
    await postMessage({
      message: result.message,
      conversationId,
    }, controllerSignal);

    return { result, conversationId };
}


