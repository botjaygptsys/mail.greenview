export interface Email {
  id: string;
  conversationId: string;
  senderName: string;
  senderEmail: string;
  recipient?: string;
  recipientName?: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  folderId: string; // 'inbox', 'sent', 'trash', or a custom folder ID
  starred: boolean;
  archived: boolean;
  important: boolean;
  labelIds: string[];
}

export type FolderId = 'inbox' | 'starred' | 'important' | 'sent' | 'drafts' | 'all-mail' | 'spam' | 'trash' | string;

export interface Folder {
  id: FolderId;
  name: string;
  icon: string;
  custom?: boolean;
}

export interface Conversation {
  id: string;
  subject: string;
  emails: Email[];
  participants: string[];
  lastTimestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isImportant: boolean;
  folderId: string;
  labelIds: string[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    conversationId?: string;
}

export interface Signature {
    id: string;
    name: string;
    content: string;
}

export interface Label {
    id: string;
    name: string;
    color: string;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export interface Settings {
    theme: 'light' | 'dark';
    defaultSignatureId: string | null;
    labels: Label[];
}

export interface AdvancedSearchFilters {
    from?: string;
    to?: string;
    subject?: string;
    hasWords?: string;
    startDate?: string;
    endDate?: string;
}

export interface User {
    email: string;
    name: string;
    avatarUrl: string;
}

export type AiAction = 'summarize' | 'draft' | null;

export type ViewMode = 'mail' | 'calendar' | 'contacts';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO String
  end: string;   // ISO String
  allDay: boolean;
}
