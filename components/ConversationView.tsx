import React from 'react';
import type { Conversation, Label, Settings } from '../types';
import Tooltip from './Tooltip';

interface Props {
  conversation: Conversation;
  labels: Label[];
  aiLoading: string | null;
  onSummarize: () => void;
  onDraft: () => void;
  onAction: (action: 'archive' | 'star' | 'important' | 'trash' | 'spam' | 'not_spam') => void;
  onReply: () => void;
  currentSummary: string | null;
}

const ConversationView: React.FC<Props> = ({ conversation, labels, aiLoading, onSummarize, onDraft, onAction, onReply, currentSummary }) => (
  <div className="flex-1 flex flex-col h-full bg-white dark:bg-charcoal">
    <div className="p-4 border-b border-subtle dark:border-charcoal-light flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold truncate">{conversation.subject}</h2>
        <div className="text-sm text-charcoal/60 dark:text-background/60 flex items-center gap-2">
          {conversation.isStarred && <i className="bi bi-star-fill text-yellow-500"/>}
          {conversation.isImportant && <i className="bi bi-patch-check-fill text-blue-500"/>}
          {conversation.labelIds.map(id => {
            const label = labels.find(l => l.id === id);
            return label ? <span key={id} className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: label.color, color: 'white'}}>{label.name}</span> : null;
          })}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip text="Summarize with AI"><button onClick={onSummarize} disabled={!!aiLoading} className="btn-icon">{aiLoading === 'summarize' ? <i className="bi bi-arrow-repeat animate-spin"/> : <i className="bi bi-sparkles"/>}</button></Tooltip>
        <Tooltip text="Draft Reply with AI"><button onClick={onDraft} disabled={!!aiLoading} className="btn-icon">{aiLoading === 'draft' ? <i className="bi bi-arrow-repeat animate-spin"/> : <i className="bi bi-magic"/>}</button></Tooltip>
        <Tooltip text={conversation.isStarred ? 'Unstar' : 'Star'}><button onClick={() => onAction('star')} className={`btn-icon ${conversation.isStarred ? 'text-yellow-500' : ''}`}><i className="bi bi-star"/></button></Tooltip>
        <Tooltip text="Archive"><button onClick={() => onAction('archive')} className="btn-icon"><i className="bi bi-archive"/></button></Tooltip>
        <Tooltip text="Delete"><button onClick={() => onAction('trash')} className="btn-icon"><i className="bi bi-trash"/></button></Tooltip>
        <Tooltip text="More options"><button className="btn-icon"><i className="bi bi-three-dots-vertical"/></button></Tooltip>
      </div>
    </div>
    {currentSummary && (
      <div className="p-4 bg-primary/10 border-b border-primary/20 dark:bg-primary/20 dark:border-primary/30">
        <h3 className="font-bold flex items-center gap-2"><i className="bi bi-sparkles text-primary"/> AI Summary</h3>
        <p className="text-sm mt-2">{currentSummary}</p>
      </div>
    )}
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {conversation.emails.map(email => (
        <div key={email.id} className="border border-subtle dark:border-charcoal-light rounded-lg">
          <div className="p-4 bg-background-secondary dark:bg-charcoal-light border-b border-subtle dark:border-charcoal-light flex justify-between items-center">
            <div>
              <p className="font-bold">{email.senderName}</p>
              <p className="text-sm text-charcoal/60 dark:text-background/60">To: {email.recipientName || email.recipient || 'undisclosed-recipients'}</p>
            </div>
            <p className="text-sm text-charcoal/60 dark:text-background/60">{new Date(email.timestamp).toLocaleString()}</p>
          </div>
          <div className="p-4 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: email.body }} />
        </div>
      ))}
    </div>
    <div className="p-4 border-t border-subtle dark:border-charcoal-light flex items-center gap-2">
      <button onClick={onReply} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary/90"><i className="bi bi-reply-fill"/> Reply</button>
    </div>
  </div>
);

export default ConversationView;
