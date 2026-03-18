import React from 'react';
import { Star, X, MapPin } from 'lucide-react';

interface FavoritesProps {
  favorites: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ favorites, onSelect, onRemove }) => {
  if (favorites.length === 0) return null;

  return (
    <aside className="favorites-sidebar">
      <div className="favorites-header">
        <Star size={20} fill="currentColor" />
        <h3>Favorite Cities</h3>
      </div>
      <ul className="favorites-list">
        {favorites.map(city => (
          <li key={city} className="favorite-item">
            <button
              className="favorite-select"
              onClick={() => onSelect(city)}
            >
              <MapPin size={16} />
              <span>{city}</span>
            </button>
            <button
              className="favorite-remove"
              onClick={() => onRemove(city)}
              title="Remove from favorites"
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
