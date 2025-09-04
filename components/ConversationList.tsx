import React from 'react';
import type { Conversation, Label } from '../types';

interface Props {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelect: (id: string) => void;
  onEmptyTrash: () => void;
  activeFilterId: string;
}

const ConversationList: React.FC<Props> = ({ conversations, selectedConversationId, onSelect, onEmptyTrash, activeFilterId }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  return (
    <div className="bg-background-secondary dark:bg-charcoal-light h-full flex flex-col">
      <div className="p-4 border-b border-subtle dark:border-charcoal">
        <h2 className="text-xl font-bold capitalize">{activeFilterId.replace('-', ' ')}</h2>
        <p className="text-sm text-charcoal/60 dark:text-background/60">{conversations.length} conversations</p>
      </div>
      {activeFilterId === 'trash' && conversations.length > 0 && (
        <div className="p-2 border-b border-subtle dark:border-charcoal text-center">
          <button onClick={onEmptyTrash} className="text-sm text-primary hover:underline">Empty Trash Now</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? conversations.map(c => (
          <div key={c.id} onClick={() => onSelect(c.id)} className={`p-4 border-b border-subtle dark:border-charcoal cursor-pointer transition-colors ${selectedConversationId === c.id ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-subtle dark:hover:bg-charcoal/50'}`}>
            <div className="flex justify-between items-baseline">
              <p className={`truncate max-w-[60%] font-bold ${!c.isRead ? 'text-charcoal dark:text-background' : 'text-charcoal/80 dark:text-background/80'}`}>{c.participants.join(', ')}</p>
              <p className={`text-xs ${!c.isRead ? 'text-accent font-bold' : 'text-charcoal/60 dark:text-background/60'}`}>{formatDate(c.lastTimestamp)}</p>
            </div>
            <p className={`text-sm mt-1 truncate ${!c.isRead ? 'font-bold' : ''}`}>{c.subject}</p>
            <p className="text-sm text-charcoal/60 dark:text-background/60 mt-1 truncate">{c.emails[c.emails.length - 1].body.replace(/<[^>]*>?/gm, '')}</p>
          </div>
        )) : (
          <div className="p-8 text-center text-charcoal/50 dark:text-background/50">
            <i className="bi bi-folder2-open text-5xl"></i>
            <p className="mt-2">No conversations here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
