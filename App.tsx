
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ConversationList from './components/ConversationList';
import ConversationView from './components/ConversationView';
import ComposeView from './components/ComposeView';
import Tooltip from './components/Tooltip';
    const handleLogout = () => { setUser(null); };

    const EmptyView: React.FC = () => (
        <div className="flex-1 flex items-center justify-center h-full bg-background dark:bg-charcoal text-charcoal/50 dark:text-background/50 flex-col">
            <i className="bi bi-envelope-open text-7xl mb-4"></i>
            <p className="text-lg">Select an item to read</p>
            <p className="text-sm">Nothing is selected</p>
        </div>
    );
    useEffect(() => { localStorage.setItem('greenview_emailListWidth', String(emailListWidth)); }, [emailListWidth]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isResizingSidebar.current) {
            setSidebarWidth(prev => Math.max(200, Math.min(e.clientX, 400)));
        }
        if (isResizingEmailList.current) {
            setEmailListWidth(prev => Math.max(300, Math.min(e.clientX - sidebarWidth, 600)));
        }
    }, [sidebarWidth]);

    const handleMouseUp = useCallback(() => {
        isResizingSidebar.current = false;
        isResizingEmailList.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    useEffect(() => {
        const startResize = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.id === 'sidebar-resizer') isResizingSidebar.current = true;
            if (target.id === 'emaillist-resizer') isResizingEmailList.current = true;

            if (isResizingSidebar.current || isResizingEmailList.current) {
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
            }
        };
        window.addEventListener('mousedown', startResize);
        return () => {
             window.removeEventListener('mousedown', startResize);
             window.removeEventListener('mousemove', handleMouseMove);
             window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [handleMouseMove, handleMouseUp]);

    // Request notification permission & new mail simulation
    useEffect(() => {
        if (user) {
            if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
            const interval = setInterval(() => {
                const template = NEW_EMAIL_TEMPLATES[Math.floor(Math.random() * NEW_EMAIL_TEMPLATES.length)];
                const newEmail: Email = {
                    id: `email-${Date.now()}`, conversationId: `conv-new-${Date.now()}`,
                    senderName: template.senderName!, senderEmail: template.senderEmail!,
                    subject: template.subject!, body: template.body!, timestamp: new Date().toISOString(),
                    read: false, folderId: 'inbox', starred: false, archived: false, important: false,
                    labelIds: [], cc: [], bcc: []
                };
                setEmails(prev => [newEmail, ...prev]);
                const newNotif: Notification = {
                    id: `notif-${Date.now()}`, title: `New Mail from ${newEmail.senderName}`,
                    message: newEmail.subject, timestamp: new Date().toISOString(), read: false,
                    conversationId: newEmail.conversationId,
                }
                setNotifications(prev => [newNotif, ...prev]);
                if (Notification.permission === "granted") {
                    new window.Notification(newNotif.title, { body: newNotif.message, icon: 'https://www.myoctamind.com/greenview/images/logo.png' });
                }
            }, 60000); // Every 60 seconds
            return () => clearInterval(interval);
        }
    }, [user]);

    // --- Memoized Values ---
    const allFolders = useMemo(() => [...FOLDERS, ...customFolders.map(f => ({...f, custom:true}))], [customFolders]);
    const allConversations = useMemo(() => groupEmailsToConversations(emails), [emails]);
    const filteredConversations = useMemo(() => {
        let conversations = allConversations;
        
        if (activeFilterId === 'inbox') conversations = conversations.filter(c => c.folderId === 'inbox' && !c.isArchived);
        else if (activeFilterId === 'starred') conversations = conversations.filter(c => c.isStarred && c.folderId !== 'trash' && c.folderId !== 'spam');
        else if (activeFilterId === 'important') conversations = conversations.filter(c => c.isImportant && c.folderId !== 'trash' && c.folderId !== 'spam');
        else if (activeFilterId === 'all-mail') conversations = conversations.filter(c => c.folderId !== 'trash' && c.folderId !== 'spam');
        else if (activeFilterId === 'sent' || activeFilterId === 'drafts' || activeFilterId === 'spam' || activeFilterId === 'trash') {
            conversations = conversations.filter(c => c.folderId === activeFilterId || c.emails.some(e => e.folderId === activeFilterId));
        } else { // Custom folder or label
            conversations = conversations.filter(c => c.folderId === activeFilterId || (c.labelIds || []).includes(activeFilterId));
        }

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            conversations = conversations.filter(c =>
                c.subject.toLowerCase().includes(lowercasedQuery) ||
                c.participants.some(p => p.toLowerCase().includes(lowercasedQuery)) ||
                c.emails.some(e => e.body.toLowerCase().includes(lowercasedQuery))
            );
        }
        
        const { from, to, subject, hasWords, startDate, endDate } = advancedSearchFilters;
        if (from) conversations = conversations.filter(c => c.emails.some(e => e.senderEmail.toLowerCase().includes(from.toLowerCase())));
        if (to) conversations = conversations.filter(c => c.emails.some(e => e.recipient?.toLowerCase().includes(to.toLowerCase())));
        if (subject) conversations = conversations.filter(c => c.subject.toLowerCase().includes(subject.toLowerCase()));
        if (hasWords) conversations = conversations.filter(c => c.emails.some(e => e.body.toLowerCase().includes(hasWords.toLowerCase())));
        if (startDate) conversations = conversations.filter(c => new Date(c.lastTimestamp) >= new Date(startDate));
        if (endDate) conversations = conversations.filter(c => new Date(c.lastTimestamp) <= new Date(endDate));

        return conversations;
    }, [allConversations, activeFilterId, searchQuery, advancedSearchFilters]);
    
    const selectedConversation = useMemo(() => allConversations.find(c => c.id === selectedConversationId) || null, [allConversations, selectedConversationId]);
    
    const unreadCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        allConversations.forEach(c => {
            if (!c.isRead && c.folderId === 'inbox' && !c.isArchived) {
                counts['inbox'] = (counts['inbox'] || 0) + 1;
            }
        });
        return counts;
    }, [allConversations]);

    const unreadNotifications = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
    
    // --- Handlers ---
    const handleLogin = (loggedInUser: User) => setUser(loggedInUser);
    const handleLogout = () => { setUser(null); };

    const EmptyView = () => (
            const lastEmail = conversation.emails[conversation.emails.length - 1];
            const prompt = `Based on the following email, draft a professional and helpful reply. The reply should be in HTML format, enclosed in <p> tags.\n\nFrom: ${lastEmail.senderName}\nSubject: ${lastEmail.subject}\nBody: ${lastEmail.body.replace(/<[^>]*>?/gm, '')}\n\n---\n\nDraft Reply:`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            handleCompose(true, conversation);
            const draftText = (response as any)?.text || '<p>(No AI draft produced)</p>';
            setComposeState(prev => ({ ...prev, body: (prev.body || '').replace('<p></p>', draftText) }));
                <h3 className="text-xs font-bold uppercase text-charcoal/50 dark:text-background/50 mt-6 mb-2 px-3">Labels</h3>
                <ul>
                    {labels.map(label => (
                         <li key={label.id}>
                            <a href="#" onClick={(e) => { e.preventDefault(); onSelectFilter(label.id); }} className={`flex items-center gap-3 px-3 py-2 rounded-md my-1 transition-colors ${activeFilterId === label.id ? 'bg-primary/20 text-primary dark:bg-primary/30' : 'hover:bg-subtle dark:hover:bg-charcoal'}`}>
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }}></span>
                                <span>{label.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );

    const ConversationList: React.FC<{
        conversations: Conversation[]; selectedConversationId: string | null;
        onSelect: (id: string) => void; labels: Label[];
        onEmptyTrash: () => void; activeFilterId: string;
    }> = ({ conversations, selectedConversationId, onSelect, onEmptyTrash, activeFilterId }) => {
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

    const ConversationView: React.FC<{ conversation: Conversation }> = ({ conversation }) => (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-charcoal">
            <div className="p-4 border-b border-subtle dark:border-charcoal-light flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold truncate">{conversation.subject}</h2>
                    <div className="text-sm text-charcoal/60 dark:text-background/60 flex items-center gap-2">
                        {conversation.isStarred && <i className="bi bi-star-fill text-yellow-500"></i>}
                        {conversation.isImportant && <i className="bi bi-patch-check-fill text-blue-500"></i>}
                        {conversation.labelIds.map(id => {
                            const label = settings.labels.find(l => l.id === id);
                            return label ? <span key={id} className="text-xs px-2 py-0.5 rounded" style={{backgroundColor: label.color, color: 'white'}}>{label.name}</span> : null;
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip text="Summarize with AI"><button onClick={() => handleSummarize(conversation)} disabled={!!aiLoading} className="btn-icon">{aiLoading === 'summarize' ? <i className="bi bi-arrow-repeat animate-spin"></i> : <i className="bi bi-sparkles"></i>}</button></Tooltip>
                    <Tooltip text="Draft Reply with AI"><button onClick={() => handleDraftReply(conversation)} disabled={!!aiLoading} className="btn-icon">{aiLoading === 'draft' ? <i className="bi bi-arrow-repeat animate-spin"></i> : <i className="bi bi-magic"></i>}</button></Tooltip>
                    <Tooltip text={conversation.isStarred ? "Unstar" : "Star"}><button onClick={() => handleConversationAction(conversation.id, 'star')} className={`btn-icon ${conversation.isStarred ? 'text-yellow-500' : ''}`}><i className="bi bi-star"></i></button></Tooltip>
                    <Tooltip text="Archive"><button onClick={() => handleConversationAction(conversation.id, 'archive')} className="btn-icon"><i className="bi bi-archive"></i></button></Tooltip>
                    <Tooltip text="Delete"><button onClick={() => handleConversationAction(conversation.id, 'trash')} className="btn-icon"><i className="bi bi-trash"></i></button></Tooltip>
                    <Tooltip text="More options"><button className="btn-icon"><i className="bi bi-three-dots-vertical"></i></button></Tooltip>
                </div>
            </div>
            
            {currentSummary && (
                <div className="p-4 bg-primary/10 border-b border-primary/20 dark:bg-primary/20 dark:border-primary/30">
                    <h3 className="font-bold flex items-center gap-2"><i className="bi bi-sparkles text-primary"></i> AI Summary</h3>
                    <p className="text-sm mt-2">{currentSummary}</p>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {conversation.emails.map((email, index) => (
                    <div key={email.id} className="border border-subtle dark:border-charcoal-light rounded-lg">
                        <div className="p-4 bg-background-secondary dark:bg-charcoal-light border-b border-subtle dark:border-charcoal-light flex justify-between items-center">
                            <div>
                                <p className="font-bold">{email.senderName}</p>
                                <p className="text-sm text-charcoal/60 dark:text-background/60">To: {email.recipientName || email.recipient || 'undisclosed-recipients'}</p>
                            </div>
                            <p className="text-sm text-charcoal/60 dark:text-background/60">{new Date(email.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="p-4 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: email.body }}></div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-subtle dark:border-charcoal-light flex items-center gap-2">
                <button onClick={() => handleCompose(true, conversation)} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary/90"><i className="bi bi-reply-fill"></i> Reply</button>
            </div>
        </div>
    );
    
    const EmptyView = () => (
        <div className="flex-1 flex items-center justify-center h-full bg-background dark:bg-charcoal text-charcoal/50 dark:text-background/50 flex-col">
            <i className="bi bi-envelope-open text-7xl mb-4"></i>
            <p className="text-lg">Select an item to read</p>
            <p className="text-sm">Nothing is selected</p>
        </div>
    );

    const ComposeView: React.FC = () => {
        const bodyRef = useRef<HTMLDivElement>(null);

        const send = () => {
            handleSendEmail({
                recipient: composeState.recipient,
                subject: composeState.subject || '(no subject)',
                body: bodyRef.current?.innerHTML || '',
                cc: composeState.cc,
                bcc: composeState.bcc,
                labelIds: [],
                important: false,
                conversationId: composeState.conversationId || '',
                archived: false,
                starred: false,
            }, composeState.conversationId || null);
        };
        
        const saveDraft = () => {
             handleSaveDraft({
                ...composeState,
                body: bodyRef.current?.innerHTML || '',
            });
        };

        const discard = () => {
            if(window.confirm('Are you sure you want to discard this draft?')) {
                setMailViewMode('read');
                setComposeState({});
            }
        };

        return (
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-charcoal p-4 gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-subtle dark:border-charcoal-light">
                    <h2 className="text-xl font-bold">{composeState.isReply ? `Re: ${composeState.originalConversation?.subject}` : 'New Message'}</h2>
                    <button onClick={discard}><i className="bi bi-x-lg"></i></button>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-charcoal/60 dark:text-background/60">To:</label>
                    <input type="email" placeholder="Recipient" value={composeState.recipient || ''} onChange={e => setComposeState(p => ({ ...p, recipient: e.target.value }))} className="flex-1 bg-transparent focus:outline-none"/>
                </div>
                <input type="text" placeholder="Subject" value={composeState.subject || ''} onChange={e => setComposeState(p => ({ ...p, subject: e.target.value }))} className="w-full bg-transparent p-2 border-b border-subtle dark:border-charcoal-light focus:outline-none focus:border-primary"/>
                <div ref={bodyRef} contentEditable="true" suppressContentEditableWarning className="flex-1 p-2 focus:outline-none overflow-y-auto" dangerouslySetInnerHTML={{ __html: composeState.body || '' }}></div>
                <div className="flex items-center justify-between pt-2 border-t border-subtle dark:border-charcoal-light">
                    <div className="flex items-center gap-2">
                         <button onClick={send} className="px-6 py-2 rounded-lg bg-accent text-white font-semibold flex items-center gap-2 hover:bg-accent/90">Send</button>
                         <Tooltip text="Save Draft"><button onClick={saveDraft} className="btn-icon"><i className="bi bi-save"></i></button></Tooltip>
                    </div>
                    <Tooltip text="Discard Draft"><button onClick={discard} className="btn-icon hover:text-red-500"><i className="bi bi-trash"></i></button></Tooltip>
                </div>
            </div>
        );
    };

    const CalendarView: React.FC = () => {
        const [currentDate, setCurrentDate] = useState(new Date());
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const calendarDays = Array(daysInMonth).fill(0).map((_, i) => i + 1);
        const leadingEmptyDays = Array(firstDay).fill(null);
        
        const changeMonth = (offset: number) => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + offset, 1));
        
        return (
            <div className="flex-1 p-6 bg-white dark:bg-charcoal">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1>
                    <div className="flex gap-2">
                        <button onClick={() => changeMonth(-1)} className="btn-icon"><i className="bi bi-chevron-left"></i></button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1 text-sm border border-subtle dark:border-charcoal-light rounded-md">Today</button>
                        <button onClick={() => changeMonth(1)} className="btn-icon"><i className="bi bi-chevron-right"></i></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-px bg-subtle dark:bg-charcoal-light border border-subtle dark:border-charcoal-light">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="p-2 text-center font-bold text-sm bg-background-secondary dark:bg-charcoal">{day}</div>)}
                    {[...leadingEmptyDays, ...calendarDays].map((day, index) => (
                        <div key={index} className="p-2 h-32 bg-background dark:bg-charcoal-light overflow-y-auto">
                            {day && <span className="font-semibold">{day}</span>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const ContactsView: React.FC = () => (
         <div className="flex-1 p-6 bg-white dark:bg-charcoal">
            <h1 className="text-2xl font-bold mb-6">Contacts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {knownContacts.map(contact => (
                    <div key={contact.id} className="p-4 rounded-lg bg-background-secondary dark:bg-charcoal-light border border-subtle dark:border-charcoal">
                        <p className="font-bold text-lg">{contact.name}</p>
                        <p className="text-sm text-primary">{contact.email}</p>
                        {contact.phone && <p className="text-sm text-charcoal/60 dark:text-background/60 mt-2">{contact.phone}</p>}
                    </div>
                ))}
            </div>
         </div>
    );

        const LoginPage = ({ onLogin }: { onLogin: (user: User) => void; }) => {
                // Only allow sign-in with the Green View domain.
                const ALLOWED_DOMAIN = 'greenview.lk';
                const [email, setEmail] = useState('admin@greenview.lk');
                const [password, setPassword] = useState('');
                const [isSubmitting, setSubmitting] = useState(false);
                const [error, setError] = useState<string | null>(null);

                const validateEmailDomain = (value: string) => {
                        // Accept user@greenview.lk or user@www.greenview.lk (if user types www by habit)
                        const domain = value.split('@')[1]?.toLowerCase();
                        return domain === ALLOWED_DOMAIN || domain === `www.${ALLOWED_DOMAIN}`;
                };

                const handleSubmit = (e: React.FormEvent) => {
                        e.preventDefault();
                        setError(null);
                        if (!validateEmailDomain(email)) {
                                setError(`Only ${ALLOWED_DOMAIN} email accounts are permitted.`);
                                return;
                        }
                        if (!password) { setError('Password is required.'); return; }
                        setSubmitting(true);
                        // Simulated auth; replace with real auth provider integration later (Supabase / custom API / OAuth)
                        setTimeout(() => {
                                onLogin({ email: email.toLowerCase(), name: email.split('@')[0], avatarUrl: `https://i.pravatar.cc/150?u=${email}`});
                                setSubmitting(false);
                        }, 800);
                };
        return (
            <div className="h-screen w-screen bg-background dark:bg-charcoal flex items-center justify-center font-sans">
                <div className="w-full max-w-sm p-8 bg-white dark:bg-charcoal-light rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <img src="https://www.myoctamind.com/greenview/images/logo.png" alt="Green View Mail Logo" className="h-16 w-auto mx-auto" />
                        <h1 className="text-3xl font-serif text-charcoal dark:text-background mt-4">Green View Mail</h1>
                        <p className="text-charcoal/70 dark:text-background/70 mt-1">Sign in to continue</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-charcoal/80 dark:text-background/80">Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={e => { setEmail(e.target.value); if(error) setError(null); }}
                                                            required
                                                            placeholder={`name@${ALLOWED_DOMAIN}`}
                                                            className="w-full mt-1 p-3 border border-subtle dark:border-charcoal rounded-lg bg-subtle/50 dark:bg-charcoal/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        />
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                 <label className="text-sm font-bold text-charcoal/80 dark:text-background/80">Password</label>
                                 <a href="#" onClick={e => e.preventDefault()} className="text-sm text-primary hover:underline">Forgot password?</a>
                            </div>
                                                        <input
                                                            type="password"
                                                            value={password}
                                                            onChange={e => { setPassword(e.target.value); if(error) setError(null);} }
                                                            required
                                                            className="w-full mt-1 p-3 border border-subtle dark:border-charcoal rounded-lg bg-subtle/50 dark:bg-charcoal/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        />
                        </div>
                                                {error && (
                                                    <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-200 dark:border-red-700">
                                                         {error}
                                                    </div>
                                                )}
                        <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors shadow-md flex items-center justify-center gap-2 disabled:bg-accent/50">
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                                                <p className="text-xs text-center text-charcoal/60 dark:text-background/50">Access restricted to authorized {ALLOWED_DOMAIN} accounts.</p>
                    </form>
                </div>
            </div>
        );
    }
    
    if (!user) return <LoginPage onLogin={handleLogin} />;
          
    return (
        <div className="h-screen w-screen bg-background dark:bg-charcoal font-sans text-charcoal dark:text-background flex flex-col overflow-hidden">
          {/* Header Implementation will go here */}
          <div className="flex flex-1 min-h-0">
             <div style={{ width: sidebarWidth, flexShrink: 0 }} className="h-full">
                <Sidebar 
                    mainView={mainView} onSetMainView={setMainView}
                    folders={allFolders} labels={settings.labels} activeFilterId={activeFilterId} 
                    onSelectFilter={(id) => {setActiveFilterId(id); handleSelectConversation(null);}}
                    onCompose={() => handleCompose()}
                    unreadCounts={unreadCounts}
                />
            </div>
            <div id="sidebar-resizer" className="panel-resizer"></div>
            
            { mainView === 'mail' && (
                <>
                    <div style={{ width: emailListWidth, flexShrink: 0 }} className="flex flex-col min-w-0 border-r border-subtle dark:border-charcoal-light h-full">
                       <ConversationList 
                          conversations={filteredConversations}
                          selectedConversationId={selectedConversationId}
                          onSelect={handleSelectConversation}
                          labels={settings.labels}
                          onEmptyTrash={handleEmptyTrash}
                          activeFilterId={activeFilterId}
                       />
                    </div>
                    <div id="emaillist-resizer" className="panel-resizer"></div>
                    <main className="flex-1 flex flex-col min-w-0 h-full">
                        {/* Main content will be rendered here based on view mode */}
                        { mailViewMode === 'read' && selectedConversation && <ConversationView conversation={selectedConversation} /> }
                        { mailViewMode === 'read' && !selectedConversation && <EmptyView /> }
                        { mailViewMode === 'compose' && <ComposeView /> }
                    </main>
                </>
            )}
            { mainView === 'calendar' && <CalendarView /> }
            { mainView === 'contacts' && <ContactsView /> }
          </div>
           {/* Modals and Toast will be rendered here */}
        </div>
    );
};

export default App;
