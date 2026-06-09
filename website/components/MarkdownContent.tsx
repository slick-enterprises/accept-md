import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert prose-blog max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            const code = React.Children.only(children) as React.ReactElement<{
              className?: string;
              children?: React.ReactNode;
            }>;
            const lang =
              (code.props?.className ?? "").match(/language-(\S+)/)?.[1] ??
              "text";

            return (
              <CodeBlock language={lang} className="my-6">
                {code.props?.children}
              </CodeBlock>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
