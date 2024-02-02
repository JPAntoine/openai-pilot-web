import { AppDispatch, RootState } from "@/app/store";
import { PrimaryButton } from "@/features/shared/buttons/PrimaryButton";
import Plus from "@/icons/Plus";
import { useDispatch, useSelector } from "react-redux";
import { setActiveConversationId } from "../chatbox/slices/conversationSlice";
import ConversationHistory from "./ConversationHistory";

const NewChatButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const isProcessingCompletion = useSelector(
    (state: RootState) => state.conversation.isProcessingCompletion
  );

  const onClickNewChat = () => {
    dispatch(setActiveConversationId(null));
  };

  return (
    <PrimaryButton
      onClick={onClickNewChat}
      className="font-sf h-10 text-[1.0625rem] flex items-center justify-center gap-1"
      disabled={isProcessingCompletion}
    >
      <Plus />
      <div className="leading-5">New Chat</div>
    </PrimaryButton>
  );
};

const History: React.FC = () => {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-accent-1 h-24 flex items-center font-bold justify-center rounded-t-md p-3 text-xl">
        Chat History
      </div>
      <ConversationHistory />
      <div className="bg-secondary flex items-center justify-center rounded-b-md px-4 py-3">
        <NewChatButton />
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="flex h-full min-h-0 min-w-min flex-col text-white shadow-custom">
      <div className="flex h-full min-h-0 w-72 flex-col gap-2">
        <History />
      </div>
    </div>
  );
};
export default Sidebar;
