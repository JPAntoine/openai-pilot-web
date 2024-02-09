import { Action, EnhancedStore, StoreEnhancer, ThunkDispatch, Tuple, UnknownAction, configureStore } from '@reduxjs/toolkit';
import conversationReducer, {
  generateTitleThunk,
  completeChatThunk,
  setActiveConversationId,
  setIsProcessingCompletion,
  setInFlightMessage,
  setHasCompletionError,
  setUserInput,
  setPendingMessage,
  ConversationState,
  initialState as initialConversationState,
} from '@/features/chatbox/slices/conversationSlice';
import * as api from "@/features/chatbox/api/chatService"; 
import { GenerateTitleArgs } from '@/features/chatbox/api/chatService';
import MockAdapter from 'axios-mock-adapter';
import { baseAxiosInstance } from '@/app/base-api';
import axios from 'axios';



describe("conversationSlice with retry logic", () => {
    let store: EnhancedStore<{ conversation: ConversationState; }, Action, Tuple<[StoreEnhancer<{ dispatch: ThunkDispatch<{ conversation: ConversationState; }, undefined, UnknownAction>; }>, StoreEnhancer]>>; // Replace 'typeof middlewares' with actual middleware array if used
    let mock: MockAdapter;

    beforeEach(() => {
        store = configureStore({ reducer: { conversation: conversationReducer } });
        mock = new MockAdapter(baseAxiosInstance);
        // Mocking API responses for generateTitle and completeChat
        mock.onPost(api.generateTitleApiEndpoint).reply(200, { title: 'Generated Title' });
        mock.onPost(api.completeChatApiEndpoint).reply(200, {
            conversationId: 'newConversationId',
            message: { /* mock message object */ },
        });
    });

    afterEach(() => {
        mock.restore(); // Restore axios adapter to default after each test
    });

    it("should handle generateTitleThunk successfully", async () => {
        const generateTitleArgs: GenerateTitleArgs = { conversationId: '123'};
        const mockCancelTokenSource = axios.CancelToken.source();
        await store.dispatch(generateTitleThunk({ args: generateTitleArgs, cancelToken: mockCancelTokenSource.token, dispatch: store.dispatch }));
        const state = store.getState().conversation;
        expect(state.conversation.title).toBe('Generated Title');
    });   

    it("should handle completeChatThunk successfully", async () => {
        const mockCancelTokenSource = axios.CancelToken.source();
        await store.dispatch(completeChatThunk({ cancelToken: mockCancelTokenSource.token, dispatch: store.dispatch }));
        const state = store.getState().conversation;
        expect(state.activeConversationId).toBe('newConversationId');
        expect(state.conversation.messages).toContainEqual(expect.objectContaining({ /* mock message object */ }));
    });

    it("should handle completeChatThunk with API failure", async () => {
        mock.onPost(api.completeChatApiEndpoint).networkError();
        const mockCancelTokenSource = axios.CancelToken.source();
        await store.dispatch(completeChatThunk({ cancelToken: mockCancelTokenSource.token, dispatch: store.dispatch }));
        const state = store.getState().conversation;
        expect(state.hasCompletionError).toBe(true);
        expect(state.isLoading).toBe(false);
        expect(state.isProcessingCompletion).toBe(false);
        expect(state.inFlightMessage).toBe("");
    });

    it('should handle setActiveConversationId with null', () => {
        const action = { type: setActiveConversationId.type, payload: null };
        const state = conversationReducer(initialConversationState, action);
        expect(state).toEqual({
          ...initialConversationState,
          conversation: initialConversationState.conversation,
          userInput: '',
          activeConversationId: '',
        });
      });
    
      it('should handle setActiveConversationId with a valid ID', () => {
        const newId = '123';
        const action = { type: setActiveConversationId.type, payload: newId };
        const modifiedState = {
          ...initialConversationState,          
          activeConversationId: '123', 
        };
        const state = conversationReducer(modifiedState, action);
        expect(state.activeConversationId).toBe(newId);
      });

      it('should handle setIsProcessingCompletion correctly', () => {
        const action = { type: setIsProcessingCompletion.type, payload: true };
        const state = conversationReducer(initialConversationState, action);
        expect(state.isProcessingCompletion).toBe(true);
      });
      
      it('should handle setInFlightMessage correctly', () => {
        const testMessage = 'Testing message';
        const action = { type: setInFlightMessage.type, payload: testMessage };
        const state = conversationReducer(initialConversationState, action);
        expect(state.inFlightMessage).toBe(testMessage);
      });

      it('should handle setHasCompletionError', () => {
        const action = { type: setHasCompletionError.type };
        const state = conversationReducer(initialConversationState, action);
        expect(state.hasCompletionError).toBe(true);
      });
      
      it('should handle setUserInput correctly', () => {
        const userInput = 'New user input';
        const action = { type: setUserInput.type, payload: userInput };
        const state = conversationReducer(initialConversationState, action);
        expect(state.userInput).toBe(userInput);
      });
      
      it('should handle setPendingMessage correctly', () => {
        const pendingMessage = 'Pending message';
        const action = { type: setPendingMessage.type, payload: pendingMessage };
        const state = conversationReducer(initialConversationState, action);
        expect(state.pendingMessage).toBe(pendingMessage);
      });
      
});