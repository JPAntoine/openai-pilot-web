import React from 'react';
import { Citation } from '../api/chatService';

export interface CitationListProps {
    citations: Citation[];
    setPdf: (citation: Citation) => void;
    openModal: () => void;
}

export const CitationList: React.FC<CitationListProps> = ({ citations, setPdf, openModal }) => {
    return (
      <div className="flex flex-wrap gap-2">
        <div>References:</div>
        {citations.map((citation) => (
          <div className="flex group" key={citation.id}>
            <button
              className="text-base text-white underline"
              onClick={() => {
                setPdf(citation);
                openModal();
              }}
            >
              {`${citation.fileName} (p. ${citation.startPage})`}
            </button>
            <span className="group-last:invisible">,</span>
          </div>
        ))}
      </div>
    );
  };