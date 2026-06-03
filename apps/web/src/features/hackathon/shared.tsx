import { Body, Label } from "@ui/components/server";

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-divider-gray-light grid grid-cols-[88px_minmax(0,1fr)] gap-3 border-b py-3 last:border-b-0">
      <Label size="xs" className="text-text-subtle">
        {label}
      </Label>
      <Body size="s" className="text-text-basic break-all font-bold">
        {value}
      </Body>
    </div>
  );
}

export function Notice({ title, body }: { title: string; body: string }) {
  return (
    <article className="border-divider-gray-light border-b py-3 last:border-b-0">
      <Label size="s" className="text-text-basic mb-0.5 block font-bold">
        {title}
      </Label>
      <Body size="s" className="text-text-subtle">
        {body}
      </Body>
    </article>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3 border-border-gray-light bg-surface-white border p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <Label
          size="xs"
          className="text-text-primary mb-2 block font-bold uppercase tracking-[0.15em]"
        >
          {eyebrow}
        </Label>
        <h2 className="text-heading-s-mobile sm:text-heading-s text-text-basic font-bold">
          {title}
        </h2>
      </div>
      {count && (
        <span className="bg-surface-primary-subtler text-text-primary text-label-xs inline-flex h-7 items-center whitespace-nowrap rounded-full px-3 font-bold">
          {count}
        </span>
      )}
    </div>
  );
}
