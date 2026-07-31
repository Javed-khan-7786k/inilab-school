import React from 'react';

interface MessageToolbarProps {
  onCheckAll: () => void;
  onDeleteSelected: () => void;
  onRefresh: () => void;
}

export const MessageToolbar: React.FC<MessageToolbarProps> = ({
  onCheckAll,
  onDeleteSelected,
  onRefresh,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCheckAll}
          className="p-2 bg-[#1abc9c] hover:opacity-90 text-white rounded transition-opacity cursor-pointer border-0 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDeleteSelected}
          className="p-2 bg-iconred hover:opacity-90 text-white rounded transition-opacity cursor-pointer border-0 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="p-2 bg-blue-500 hover:opacity-90 text-white rounded transition-opacity cursor-pointer border-0 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};
