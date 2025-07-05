
'use client';

import ReactMarkdown from 'react-markdown';

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
        h2: ({node, ...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
        h3: ({node, ...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
        h4: ({node, ...props}) => <h4 className="text-lg font-bold my-1" {...props} />,
        ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-4" {...props} />,
        ul: ({node, ...props}) => <ul className="list-disc pl-5 my-4" {...props} />,
        li: ({node, ...props}) => <li className="my-1" {...props} />,
      }}>{content}</ReactMarkdown>
  );
}
