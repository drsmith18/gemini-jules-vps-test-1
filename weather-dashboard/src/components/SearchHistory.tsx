import React from 'react';
import { History } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  onSelect: (city: string) => void;
  onClear: () => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="search-history">
      <div className="history-header">
        <div className="history-title">
          <History size={16} />
          <span>Recent Searches</span>
        </div>
        <button className="clear-btn" onClick={onClear}>Clear</button>
      </div>
      <div className="history-chips">
        {history.map((city) => (
          <button 
            key={city} 
            className="history-chip"
            onClick={() => onSelect(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
