

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ElaborateDescription = ({ content }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [formattedContent, setFormattedContent] = React.useState('');

  React.useEffect(() => {
    if (!content) return;
    
    // Split content into paragraphs after every two periods
    const paragraphs = content.split(/(?<=\.\s[^\.]*\.)\s+/);
    setFormattedContent(paragraphs);
  }, [content]);

  if (!content) return null;

  return (
    <div className="mt-6 bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-300">
      <div 
        className={`prose prose-invert max-w-none px-6 py-4 text-gray-300 ${
          expanded ? 'max-h-full' : 'max-h-32 overflow-hidden'
        }`}
      >
        {formattedContent && formattedContent.map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
      
      {formattedContent.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-600/50 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Read More
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ElaborateDescription;