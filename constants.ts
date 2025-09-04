import type { Folder, Email, Label, Contact, CalendarEvent } from './types';

export const FOLDERS: Folder[] = [
  { id: 'inbox', name: 'Inbox', icon: 'bi-inbox-fill' },
  { id: 'starred', name: 'Starred', icon: 'bi-star-fill' },
  { id: 'important', name: 'Important', icon: 'bi-patch-check-fill' },
  { id: 'sent', name: 'Sent', icon: 'bi-send-fill' },
  { id: 'drafts', name: 'Drafts', icon: 'bi-file-earmark-text-fill' },
  { id: 'all-mail', name: 'All Mail', icon: 'bi-archive-fill' },
  { id: 'spam', name: 'Spam', icon: 'bi-exclamation-octagon-fill' },
  { id: 'trash', name: 'Trash', icon: 'bi-trash-fill' },
];

export const PREDEFINED_LABELS: Label[] = [
    { id: 'label-1', name: 'Work', color: '#4285F4' },
    { id: 'label-2', name: 'Personal', color: '#34A853' },
    { id: 'label-3', name: 'Receipts', color: '#FBBC05' },
];

export const PREDEFINED_CONTACTS: Contact[] = [
    { id: 'contact-1', name: 'Elena Petrova', email: 'elena.p@example.com', phone: '555-0101', address: '123 Work Ave, Business City' },
    { id: 'contact-2', name: 'John Appleseed', email: 'john.a@corp.com', phone: '555-0102', address: '456 Corporate Blvd, Suite 500' },
    { id: 'contact-3', name: 'Acme Design Co.', email: 'notifications@acme.design' },
    { id: 'contact-4', name: 'Maria Rodriguez', email: 'maria.r@example.com', phone: '555-0103', address: '789 Home St, Townsville' },
];

export const MOCK_EMAILS: Email[] = [
  // Conversation 1: Project Alpha (Starred, Important, Labeled 'Work')
  {
    id: '1',
    conversationId: 'conv-1',
    senderName: 'Elena Petrova',
    senderEmail: 'elena.p@example.com',
    subject: 'Project Alpha Kick-off',
    body: `<p>Hi Team,</p><p>Excited to kick off <strong>Project Alpha</strong> next week! Please review the attached brief and come prepared with your initial thoughts for our meeting on Monday at 10 AM.</p><p>Best,<br/>Elena</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: false, folderId: 'inbox', starred: true, archived: false, important: true,
    labelIds: ['label-1'], cc: [], bcc: [],
  },
  {
    id: '6',
    conversationId: 'conv-1',
  senderName: 'Me', senderEmail: 'user@greenview.lk',
    recipient: 'elena.p@example.com', recipientName: 'Elena Petrova',
    subject: 'Re: Project Alpha Kick-off',
    body: `<p>Thanks Elena, looking forward to it. I've reviewed the brief and have a few ideas to share.</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true, folderId: 'sent', starred: true, archived: false, important: true,
    labelIds: ['label-1'], cc: [], bcc: [],
  },
  
  // Conversation 2: Design Feedback (Labeled 'Work')
  {
    id: '3',
    conversationId: 'conv-2',
    senderName: 'Acme Design Co.', senderEmail: 'notifications@acme.design',
    subject: 'Your design feedback is requested',
    body: `<p>Hi there, the latest mockups for the new homepage are ready for your review. Please leave your feedback by EOD Friday.</p>
           <p>Here's a sample table:</p>
           <table border="1" style="width:100%; border-collapse: collapse;">
             <thead style="background-color:#f2f2f2;">
               <tr><th style="padding: 8px; text-align: left;">Page</th><th style="padding: 8px; text-align: left;">Status</th></tr>
             </thead>
             <tbody>
               <tr><td style="padding: 8px;">Homepage</td><td style="padding: 8px;">Ready for Review</td></tr>
               <tr><td style="padding: 8px;">About Us</td><td style="padding: 8px;">In Progress</td></tr>
             </tbody>
           </table>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true, folderId: 'inbox', starred: false, archived: false, important: false,
    labelIds: ['label-1'], cc: [], bcc: [],
  },

  // Conversation 3 (Draft)
  {
    id: '7',
    conversationId: 'conv-3',
  senderName: 'Me', senderEmail: 'user@greenview.lk',
    recipient: 'team@example.com', recipientName: 'Team',
    subject: 'Ideas for the offsite',
    body: `<p>Hey everyone, starting to brainstorm some ideas for the upcoming team offsite. Thinking about maybe a mountain retreat or a beach day. What does everyone think?</p><ul><li>Mountain Retreat</li><li>Beach Day</li><li>City Tour</li></ul>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true, folderId: 'drafts', starred: false, archived: false, important: false,
    labelIds: [], cc: ['manager@example.com'], bcc: [],
  },
  
  // Single email, archived
  {
    id: '2',
    conversationId: 'conv-4',
    senderName: 'John Appleseed', senderEmail: 'john.a@corp.com',
    subject: 'Your Weekly Digest',
    body: `<p>Here's your weekly summary of activities and news from across the company. Top story: Our Q3 earnings exceeded expectations!</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    read: true, folderId: 'inbox', starred: false, archived: true, important: false,
    labelIds: [], cc: [], bcc: [],
  },

  // Single email, in trash
   {
    id: '8',
    conversationId: 'conv-5',
    senderName: 'Spam King', senderEmail: 'spam@offers.com',
    subject: 'You WON! Claim your prize now!',
    body: `<p>Congratulations! You have been selected as a grand prize winner! Click here to claim your reward.</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    read: true, folderId: 'trash', starred: false, archived: false, important: false,
    labelIds: [], cc: [], bcc: [],
  },

   // Spam email
   {
    id: '9',
    conversationId: 'conv-6',
    senderName: 'Suspicious Prince', senderEmail: 'prince@royal-inheritance.net',
    subject: 'URGENT BUSINESS PROPOSAL',
    body: `<p>I have an urgent business proposal for you that will be of great mutual benefit...</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    read: true, folderId: 'spam', starred: false, archived: false, important: false,
    labelIds: [], cc: [], bcc: [],
  },

   // Email with a receipt label
   {
    id: '10',
    conversationId: 'conv-7',
    senderName: 'OnlineStore', senderEmail: 'receipts@onlinestore.com',
    subject: 'Your order #12345 is confirmed',
    body: `<p>Thank you for your order! We'll let you know when it ships.</p>`,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false, folderId: 'inbox', starred: false, archived: false, important: false,
    labelIds: ['label-3'], cc: [], bcc: [],
  },
];

export const MOCK_EVENTS: CalendarEvent[] = [
    { id: 'event-1', title: 'Project Alpha Kick-off', start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), allDay: false },
    { id: 'event-2', title: 'Design Review', start: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), end: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), allDay: false },
    { id: 'event-3', title: 'Team Offsite', start: new Date(new Date().setDate(15)).toISOString(), end: new Date(new Date().setDate(16)).toISOString(), allDay: true },
];

export const NEW_EMAIL_TEMPLATES: Partial<Email>[] = [
    {
        senderName: 'Marketing Weekly',
        senderEmail: 'newsletter@marketing.com',
        subject: 'This Week in Marketing: Top Trends',
        body: '<p>Hi there, discover the latest trends shaping the marketing world this week. From AI in content creation to the rise of short-form video, we have got you covered.</p>',
    },
    {
        senderName: 'John Appleseed',
        senderEmail: 'john.a@corp.com',
        subject: 'Quick question about the report',
        body: '<p>Hey, I was just looking over the Q3 report and had a quick question about the numbers on page 5. Do you have a moment to chat this afternoon?</p>',
    }
];
