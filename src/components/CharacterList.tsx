import React from 'react';
import { cn } from '../utils/helpers';
import type { Character } from '../types/anime';

interface CharacterListProps {
  characters: Character[];
  className?: string;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, className }) => {
  if (!characters || characters.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No character information available.
      </div>
    );
  }
  
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {characters.slice(0, 12).map(({ character, role, voice_actors }) => (
        <div key={character.mal_id} className="card flex overflow-hidden">
          {/* Character image */}
          <div className="w-1/3">
            <img 
              src={character.images.jpg.image_url} 
              alt={character.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Info */}
          <div className="flex w-2/3 flex-col p-3">
            <h4 className="text-sm font-medium">{character.name}</h4>
            <span className="mb-1 text-xs text-gray-600 dark:text-gray-400">{role}</span>
            
            {voice_actors && voice_actors.length > 0 && (
              <div className="mt-auto">
                <div className="flex items-center gap-2">
                  {voice_actors[0].person.images.jpg.image_url && (
                    <img 
                      src={voice_actors[0].person.images.jpg.image_url} 
                      alt={voice_actors[0].person.name}
                      className="h-8 w-8 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div>
                    <p className="text-xs font-medium">{voice_actors[0].person.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{voice_actors[0].language}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CharacterList;