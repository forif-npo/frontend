import clsx from "clsx";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type AnnouncementMarkdownProps = {
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
          "mb-4 mt-8 text-2xl font-bold leading-tight text-gray-900 first:mt-0",
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
          "mb-3 mt-8 text-xl font-semibold leading-tight text-gray-900 first:mt-0",
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
          "mb-2 mt-6 text-lg font-semibold leading-tight text-gray-900 first:mt-0",
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
        className={clsx("my-3 text-[18px] leading-8 text-gray-900", className)}
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
          "font-medium text-[#1D40BA] underline underline-offset-4",
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
          "my-4 list-disc space-y-2 pl-6 text-[18px] leading-8 text-gray-900",
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
          "my-4 list-decimal space-y-2 pl-6 text-[18px] leading-8 text-gray-900",
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
          "border-l-4 border-[#1D40BA] bg-gray-50 px-5 py-3 text-gray-700",
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
            ? "text-sm text-gray-100"
            : "rounded bg-gray-100 px-1.5 py-0.5 text-[0.9em] text-gray-900",
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
          "my-5 overflow-x-auto rounded-lg bg-gray-900 p-4 leading-7",
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
            "w-full min-w-[560px] border-collapse text-left text-sm text-gray-900",
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
          "border border-gray-200 bg-gray-50 px-3 py-2 font-semibold",
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
        className={clsx("border border-gray-200 px-3 py-2", className)}
        {...rest}
      />
    );
  },
  hr: (props) => {
    const { className, ...rest } = omitNode(props);
    return <hr className={clsx("my-8 border-gray-200", className)} {...rest} />;
  },
};

export function AnnouncementMarkdown({ content }: AnnouncementMarkdownProps) {
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
