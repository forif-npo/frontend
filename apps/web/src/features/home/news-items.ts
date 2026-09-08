export type NewsItem = {
  type: "announcement" | "medium" | "faq";
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  href: string;
  date?: string;
};

type UnknownRecord = Record<string, unknown>;

const HTML_TAG_PATTERN = /<[^>]+>/g;
const CONTENT_IMAGE_PATTERN = /<img[^>]+src="([^"]+)"/;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getImageUrl(
  item: UnknownRecord,
  description?: string,
): string | undefined {
  const thumbnail = getString(item.thumbnail);
  if (thumbnail) return thumbnail;

  const enclosure = isRecord(item.enclosure) ? item.enclosure : undefined;
  const enclosureLink = getString(enclosure?.link);
  if (enclosureLink) return enclosureLink;

  return description?.match(CONTENT_IMAGE_PATTERN)?.[1];
}

function toMediumNewsItem(value: unknown): NewsItem | null {
  if (!isRecord(value)) return null;

  const href = getString(value.link);
  if (!href) return null;

  const description = getString(value.description);
  const guid = getString(value.guid);

  return {
    type: "medium",
    id: guid ?? href,
    title: getString(value.title) ?? "",
    excerpt: description
      ? `${description.replace(HTML_TAG_PATTERN, "").slice(0, 100)}…`
      : "",
    imageUrl: getImageUrl(value, description),
    href,
    date: getString(value.pubDate),
  };
}

export function toMediumNewsItems(value: unknown): NewsItem[] {
  if (!isRecord(value) || !Array.isArray(value.items)) return [];

  return value.items
    .slice(0, 6)
    .map(toMediumNewsItem)
    .filter((item): item is NewsItem => item !== null);
}
