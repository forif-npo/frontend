import clsx from "clsx";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

const omitNode = <T extends { node?: unknown }>(props: T) => {
  const { node, ...rest } = props;
  void node;
  return rest;
};

const components: Components = {
  h1: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <h2
        className={clsx(
          "text-text-basic mb-4 mt-8 text-2xl font-bold leading-tight first:mt-0",
          className,
        )}
        {...rest}
      />
    );
  },
  h2: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <h2
        className={clsx(
          "text-text-basic mb-3 mt-8 text-xl font-semibold leading-tight first:mt-0",
          className,
        )}
        {...rest}
      />
    );
  },
  h3: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <h3
        className={clsx(
          "text-text-basic mb-2 mt-6 text-lg font-semibold leading-tight first:mt-0",
          className,
        )}
        {...rest}
      />
    );
  },
  p: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <p
        className={clsx(
          "text-text-basic my-3 text-[18px] leading-8",
          className,
        )}
        {...rest}
      />
    );
  },
  a: (props) => {
    const { className, href, ...rest } = omitNode(props);
    const isExternal = href?.startsWith("http");

    return (
      <a
        className={clsx(
          "text-text-primary font-medium underline underline-offset-4",
          className,
        )}
        href={href}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
        {...rest}
      />
    );
  },
  ul: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <ul
        className={clsx(
          "text-text-basic my-4 list-disc space-y-2 pl-6 text-[18px] leading-8",
          className,
        )}
        {...rest}
      />
    );
  },
  ol: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <ol
        className={clsx(
          "text-text-basic my-4 list-decimal space-y-2 pl-6 text-[18px] leading-8",
          className,
        )}
        {...rest}
      />
    );
  },
  li: (props) => {
    const { className, ...rest } = omitNode(props);
    return <li className={clsx("pl-1", className)} {...rest} />;
  },
  blockquote: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <blockquote
        className={clsx(
          "border-border-primary bg-surface-primary-subtler text-text-basic border-l-4 px-5 py-3",
          className,
        )}
        {...rest}
      />
    );
  },
  code: (props) => {
    const { className, ...rest } = omitNode(props);
    const isBlockCode = className?.startsWith("language-");

    return (
      <code
        className={clsx(
          isBlockCode
            ? "text-text-basic-inverse text-sm"
            : "bg-surface-secondary-subtler border-border-secondary-light text-text-secondary rounded border px-1.5 py-0.5 text-[0.9em] font-medium",
          className,
        )}
        {...rest}
      />
    );
  },
  pre: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <pre
        className={clsx(
          "bg-gray-70 [&>code]:text-gray-5 my-5 overflow-x-auto rounded-lg p-4 leading-7 [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0",
          className,
        )}
        {...rest}
      />
    );
  },
  table: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <div className="my-6 overflow-x-auto">
        <table
          className={clsx(
            "text-text-basic w-full min-w-[560px] border-collapse text-left text-sm",
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
  th: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <th
        className={clsx(
          "border-border-gray-light bg-surface-secondary-subtler border px-3 py-2 text-center font-semibold",
          className,
        )}
        {...rest}
      />
    );
  },
  td: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <td
        className={clsx("border-border-gray-light border px-3 py-2", className)}
        {...rest}
      />
    );
  },
  hr: (props) => {
    const { className, ...rest } = omitNode(props);
    return (
      <hr
        className={clsx("border-border-gray-light my-8", className)}
        {...rest}
      />
    );
  },
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      skipHtml
    >
      {content}
    </ReactMarkdown>
  );
}
