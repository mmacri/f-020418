
import React from 'react';

interface VideoSectionProps {
  title: string;
  description: string;
  videoId: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ title, description, videoId }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>

        <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
          {description}
        </p>

        <div className="aspect-w-16 aspect-h-9 relative">
          <iframe 
            className="rounded-lg shadow-lg w-full h-96"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
