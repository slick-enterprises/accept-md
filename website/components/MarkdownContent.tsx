import React from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import {
  markdownRehypePlugins,
  markdownRemarkPlugins,
} from "@/lib/markdown-plugins";

interface MarkdownContentProps {
  content: string;
  variant?: "blog" | "docs" | "learn";
}

const proseClass: Record<NonNullable<MarkdownContentProps["variant"]>, string> = {
  blog: "prose-blog",
  docs: "prose-docs",
  learn: "prose-learn",
};

export function MarkdownContent({
  content,
  variant = "blog",
}: MarkdownContentProps) {
  return (
    <div className={`prose prose-invert ${proseClass[variant]} max-w-none`}>
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
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
