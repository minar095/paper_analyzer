
import React from 'react';

// Since we are loading these from a CDN, we need to declare them for TypeScript
declare const ReactMarkdown: any;
declare const remarkGfm: any;

interface ResultsDisplayProps {
  markdownContent: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ markdownContent }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-brand-accent prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-neutral-light prose-blockquote:border-l-brand-secondary prose-table:border-neutral-medium prose-th:bg-gray-700/50 prose-th:p-3 prose-td:p-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default ResultsDisplay;
