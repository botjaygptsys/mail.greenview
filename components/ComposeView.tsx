import React, { useRef } from 'react';
import type { Email, Conversation } from '../types';
import Tooltip from './Tooltip';

interface Props {
  composeState: Partial<Email> & { isReply?: boolean; originalConversation?: Conversation };
  onUpdate: (patch: Partial<Email>) => void;
  onSend: (htmlBody: string) => void;
  onSaveDraft: (htmlBody: string) => void;
  onDiscard: () => void;
}

const ComposeView: React.FC<Props> = ({ composeState, onUpdate, onSend, onSaveDraft, onDiscard }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const send = () => onSend(bodyRef.current?.innerHTML || '');
  const save = () => onSaveDraft(bodyRef.current?.innerHTML || '');
  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-charcoal p-4 gap-4">
      <div className="flex justify-between items-center pb-2 border-b border-subtle dark:border-charcoal-light">
        <h2 className="text-xl font-bold">{composeState.isReply ? `Re: ${composeState.originalConversation?.subject}` : 'New Message'}</h2>
        <button onClick={onDiscard}><i className="bi bi-x-lg"/></button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-charcoal/60 dark:text-background/60">To:</label>
        <input type="email" placeholder="Recipient" value={composeState.recipient || ''} onChange={e => onUpdate({ recipient: e.target.value })} className="flex-1 bg-transparent focus:outline-none"/>
      </div>
      <input type="text" placeholder="Subject" value={composeState.subject || ''} onChange={e => onUpdate({ subject: e.target.value })} className="w-full bg-transparent p-2 border-b border-subtle dark:border-charcoal-light focus:outline-none focus:border-primary"/>
      <div ref={bodyRef} contentEditable suppressContentEditableWarning className="flex-1 p-2 focus:outline-none overflow-y-auto" dangerouslySetInnerHTML={{ __html: composeState.body || '' }} />
      <div className="flex items-center justify-between pt-2 border-t border-subtle dark:border-charcoal-light">
        <div className="flex items-center gap-2">
          <button onClick={send} className="px-6 py-2 rounded-lg bg-accent text-white font-semibold flex items-center gap-2 hover:bg-accent/90">Send</button>
          <Tooltip text="Save Draft"><button onClick={save} className="btn-icon"><i className="bi bi-save"/></button></Tooltip>
        </div>
        <Tooltip text="Discard Draft"><button onClick={onDiscard} className="btn-icon hover:text-red-500"><i className="bi bi-trash"/></button></Tooltip>
      </div>
    </div>
  );
};

export default ComposeView;
