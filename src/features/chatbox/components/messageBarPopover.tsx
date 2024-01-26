import React, { useEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
} from '@floating-ui/react';
import { Paperclip, Toolbox } from '@/icons'; // Ensure this path is correct

interface MessageBarPopoverProps {
  anchor: HTMLButtonElement | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addAttachment?: () => void;
  openShortcuts?: () => void;
  onPopoverStateChange?: (x: boolean) => void;
}

const MessageBarPopover: React.FC<MessageBarPopoverProps> = ({
  anchor,
  isOpen,
  setIsOpen,
  addAttachment,
  openShortcuts,
  onPopoverStateChange,
}) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(1), flip({ mainAxis: true }), shift()],
    whileElementsMounted: autoUpdate,
    elements: {
      reference: anchor,
    },
    placement: 'top-end',
  });

  useEffect(() => {
    onPopoverStateChange?.(isOpen);
  }, [isOpen, onPopoverStateChange]);

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([click, dismiss, role]);
  const headingId = useId();

  return (
    isOpen && (
      <FloatingFocusManager context={context} modal={false}>
        <div
          className="bg-sce-grey-800 absolute flex flex-col gap-4 pl-4 pr-8 py-4 z-10 text-white text-md border border-gray-800 rounded-md shadow-md"
          ref={refs.setFloating}
          style={floatingStyles}
          aria-labelledby={headingId}
          {...getFloatingProps()}
        >
          <button
            className="flex items-center justify-left gap-3"
            onClick={openShortcuts}
          >
            <div className="w-6 align-middle">
              <Toolbox className="w-6 flex justify-center items-center" />
            </div>
            <span className="self-center">Shortcuts</span>
          </button>
          <button
            className="ml-1 flex items-center justify-left gap-3"
            onClick={addAttachment}
          >
            <div className="align-middle">
              <Paperclip className="w-5 flex justify-center items-center" />
            </div>
            <span className="self-center">Attach</span>
          </button>
        </div>
      </FloatingFocusManager>
    )
  );
};

export default MessageBarPopover;
