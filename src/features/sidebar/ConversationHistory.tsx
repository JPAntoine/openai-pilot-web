import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { ConversationHistoryItem } from "./ConversationHistoryItem";
import { setActiveConversationId } from "@/features/chatbox/slices/conversationSlice";

const ConversationHistory: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const activeConversationId = useSelector((state: RootState) => state.conversation.activeConversationId);

    const updateActiveConversationId = (id: string) => {
        dispatch(setActiveConversationId(id));
    };

    return (
      <>
        <div className={`bg-secondary scrollbar-track-sce-grey-300 scrollbar-thumb-sce-grey-200 max-w-full flex-grow overflow-hidden`}>
          {conversations?.length > 0 ? (
            conversations.map((conversation, index) => (
              conversation.title && (
                <ConversationHistoryItem
                  key={index.toString()}
                  name={conversation.title ?? "Untitled"}
                  conversationID={conversation.id}
                  onClick={() => updateActiveConversationId(conversation.id)}
                  selected={activeConversationId === conversation.id}
                />
              )
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <ClipLoader color="#FFFFFF" speedMultiplier={0.5} />
            </div>
          )}
        </div>
      </>
    );
};

export default ConversationHistory;
