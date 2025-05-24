import React from 'react';
import { cn, getYoutubeId } from '../utils/helpers';

interface YouTubeEmbedProps {
  url?: string;
  videoId?: string;
  title?: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  videoId: propVideoId,
  title = 'YouTube video player',
  className,
}) => {
  // Use videoId prop if provided, otherwise extract from URL
  const videoId = propVideoId || getYoutubeId(url);
  
  if (!videoId) return null;
  
  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-lg', className)}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute left-0 top-0 h-full w-full border-0"
      />
    </div>
  );
};

export default YouTubeEmbed;