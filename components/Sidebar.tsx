import React from 'react';
import type { Folder, Label, ViewMode } from '../types';

interface Props {
  mainView: ViewMode; onSetMainView: (v: ViewMode) => void;
  folders: Folder[]; labels: Label[]; activeFilterId: string;
  onSelectFilter: (id: string) => void; onCompose: () => void;
  unreadCounts: Record<string, number>;
}

const Sidebar: React.FC<Props> = ({ mainView, onSetMainView, folders, labels, activeFilterId, onSelectFilter, onCompose, unreadCounts }) => (
  <div className="bg-background-secondary dark:bg-charcoal-light h-full p-3 flex flex-col">
    <button onClick={onCompose} className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-accent/90 transition-colors shadow-md flex items-center justify-center gap-2 mb-4">
      <i className="bi bi-pencil-square"/> Compose
    </button>
    <div className="flex items-center justify-around bg-subtle dark:bg-charcoal p-1 rounded-lg mb-4">
      {(['mail','calendar','contacts'] as ViewMode[]).map(view => (
        <button key={view} onClick={() => onSetMainView(view)} className={`flex-1 capitalize text-center py-2 rounded-md transition-colors ${mainView === view ? 'bg-primary text-white shadow' : 'hover:bg-subtle-dark'}`}>
          <i className={`bi bi-${view === 'mail' ? 'envelope' : view === 'calendar' ? 'calendar-week' : 'people'}`}></i>
        </button>
      ))}
    </div>
    <nav className="flex-1 overflow-y-auto pr-1">
      <ul>
        {folders.map(folder => (
          <li key={folder.id}>
            <a href="#" onClick={e => { e.preventDefault(); onSelectFilter(folder.id); }} className={`flex items-center justify-between px-3 py-2 rounded-md my-1 transition-colors ${activeFilterId === folder.id ? 'bg-primary/20 text-primary dark:bg-primary/30' : 'hover:bg-subtle dark:hover:bg-charcoal'}`}>
              <span className="flex items-center gap-3"><i className={`bi ${folder.icon}`}></i> {folder.name}</span>
              {unreadCounts[folder.id] > 0 && <span className="bg-accent text-white text-xs font-bold rounded-full px-2 py-0.5">{unreadCounts[folder.id]}</span>}
            </a>
          </li>
        ))}
      </ul>
      <h3 className="text-xs font-bold uppercase text-charcoal/50 dark:text-background/50 mt-6 mb-2 px-3">Labels</h3>
      <ul>
        {labels.map(label => (
          <li key={label.id}>
            <a href="#" onClick={e => { e.preventDefault(); onSelectFilter(label.id); }} className={`flex items-center gap-3 px-3 py-2 rounded-md my-1 transition-colors ${activeFilterId === label.id ? 'bg-primary/20 text-primary dark:bg-primary/30' : 'hover:bg-subtle dark:hover:bg-charcoal'}`}>
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: label.color }}></span>
              <span>{label.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export default Sidebar;
