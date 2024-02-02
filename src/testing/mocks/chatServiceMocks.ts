import MockAdapter from 'axios-mock-adapter';
import { baseAxiosInstance } from "@/app/base-api";
import { CompleteChatResponse } from '@/features/chatbox/api/chatService';

const mock = new MockAdapter(baseAxiosInstance);
const mockDelay = 2500;

// Mock data for completeChat
const mockCompleteChatResponse: CompleteChatResponse = {
    message: {
      role: "assistant",
      content: "This is a mock response",
      // ... other properties except 'id' and 'conversationId'
    }
  };

  const mockTitleResponse = {
    title: "Mock Title"
  };
  
  // Mock for completeChat
  mock.onPost("/chat").reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, mockCompleteChatResponse]);
      }, mockDelay);
    });
  });

  // Mock for generateTitle
  mock.onPost(new RegExp("/conversation/[\\w.-]+/generateTitle")).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, mockTitleResponse]); // Sending back a 200 status for successful title generation
      }, mockDelay);
    });
  });


if (process.env.NODE_ENV !== 'production') {
    import('./chatServiceMocks');
}
