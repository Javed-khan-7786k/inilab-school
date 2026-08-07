import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSidebar } from '../../components/message/MessageSidebar';
import type { Folder } from '../../components/message/MessageSidebar';
import { MessageToolbar } from '../../components/message/MessageToolbar';
import { MessageTableControls } from '../../components/message/MessageTableControls';
import { MessageTableContent } from '../../components/message/MessageTableContent';
import { MessageSettingsView } from '../../components/message/MessageSettingsView';

export interface Message {
  id: number;
  status: string;
  name: string;
  subject: string;
  attach: string;
  time: string;
  reply: string;
}

const INITIAL_FOLDERS: Folder[] = [
  { name: 'Conversation', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', active: true },
  { name: 'Drafts', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', active: false },
  { name: 'Sent', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', active: false },
  { name: 'Trash', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', active: false },
  { name: 'Message Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', active: false },
];

export const MessagePage: React.FC = () => {
  const { t } = useLanguage();
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleFolderClick = (name: string) => {
    setFolders(
      folders.map((f) => ({
        ...f,
        active: f.name === name,
      }))
    );
  };

  const handleComposeClick = () => {
    alert("Compose Message: Success!");
  };

  const handleCheckAll = () => {
    alert("Select All Messages");
  };

  const handleDeleteSelected = () => {
    setMessages([]);
    alert("Messages Cleared!");
  };

  const handleRefresh = () => {
    // Generate simulated dynamic inbox mock messages
    const newMsg: Message = {
      id: messages.length + 1,
      status: "Active",
      name: "Ali Shohag",
      subject: "Vite build query",
      attach: "",
      time: new Date().toLocaleTimeString(),
      reply: ""
    };
    setMessages([newMsg, ...messages]);
  };

  const activeFolder = folders.find((f) => f.active)?.name || 'Conversation';

  const filteredMessages = messages.filter((m) => {
    return (
      searchTerm === '' ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, recordsPerPage, filteredMessages.length]);

  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + recordsPerPage);

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
        {/* Left Folder Side Bar */}
        <MessageSidebar
          folders={folders}
          onFolderClick={handleFolderClick}
          onComposeClick={handleComposeClick}
        />

        {/* Dynamic content cards */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-[#e7eaec] overflow-hidden flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="bg-sidebar text-white px-6 py-4">
            <h2 className="text-lg font-semibold">{t(activeFolder)}</h2>
          </div>

          {activeFolder === 'Message Settings' ? (
            <MessageSettingsView />
          ) : (
            <>
              {/* Action Toolbar */}
              <MessageToolbar
                onCheckAll={handleCheckAll}
                onDeleteSelected={handleDeleteSelected}
                onRefresh={handleRefresh}
              />

              {/* Search bar controls */}
              <MessageTableControls
                recordsPerPage={recordsPerPage}
                setRecordsPerPage={setRecordsPerPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              {/* Data List table grid */}
              <MessageTableContent
                messages={paginatedMessages}
                recordsPerPage={recordsPerPage}
                currentPage={currentPage}
                totalCount={messages.length}
                filteredCount={filteredMessages.length}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
