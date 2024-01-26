import MockAdapter from 'axios-mock-adapter';
import { baseAxiosInstance } from "@/app/base-api";
import { CompleteChatResponse, PostConversationResponse, PostMessageResponse } from '@/features/chatbox/api/chatService';

const mock = new MockAdapter(baseAxiosInstance);
const mockDelay = 500;

// Mock data for completeChat
const mockCompleteChatResponse: CompleteChatResponse = {
    message: {
      role: "assistant",
      content: "This is a mock response",
      // ... other properties except 'id' and 'conversationId'
    }
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
mock.onPut(new RegExp("/conversation/\\w+/generateTitle")).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200]); // Sending back a 200 status for successful title generation
      }, mockDelay);
    });
  });

  // Mock data for postConversation
const mockPostConversationData: PostConversationResponse = {
    conversation: {
      id: "123", // Example ID, adjust as needed
      name: "New Conversation",
      user: {
        // Populate with mock user data
        id: "user1",
        email: "user1@example.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      titleGenerated: false
    }
  };
  
  // Mock for postConversation 
  mock.onPost("/conversation").reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // You can add logic here to customize the response based on config.data
        resolve([200, mockPostConversationData]);
      }, mockDelay);
    });
  });

// Mock data for postMessage
const mockPostMessageData: PostMessageResponse = {
    message: {
      id: "msg1", // Example ID, adjust as needed
      role: "user",
      content: "Mock message content",
      conversationId: "123", // Example conversation ID, adjust as needed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Include any other required fields
    }
  };
  
  // Mock for postMessage 
  mock.onPost(new RegExp("/conversation/\\w+/message")).reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // You can add logic here to customize the response based on config.data
        resolve([200, mockPostMessageData]);
      }, mockDelay);
    });
  });

if (process.env.NODE_ENV !== 'production') {
    import('./chatServiceMocks');
}
