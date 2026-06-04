import { getAnnouncements } from "@/features/support/announcements/api/announcements.api";
import { NewsSectionClient } from "./NewsSectionClient";

export type NewsItem = {
  type: "announcement" | "medium" | "faq";
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  href: string;
  linkLabel: string;
};

async function getMediumPosts(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/forif",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.items ?? []).slice(0, 6).map((item: any) => {
      // rss2json provides thumbnail, fallback to first <img> in content
      let imageUrl: string | undefined =
        item.thumbnail || item.enclosure?.link || undefined;
      if (!imageUrl && item.description) {
        const match = item.description.match(/<img[^>]+src="([^"]+)"/);
        if (match) imageUrl = match[1];
      }
      return {
        type: "medium" as const,
        id: item.guid ?? item.link,
        title: item.title,
        excerpt: item.description
          ? item.description.replace(/<[^>]+>/g, "").slice(0, 100) + "…"
          : "",
        imageUrl,
        href: item.link,
        linkLabel: "자세히보기 →",
      };
    });
  } catch {
    return [];
  }
}

export async function NewsSection() {
  const [announcements, mediumPosts] = await Promise.all([
    getAnnouncements().catch(() => []),
    getMediumPosts(),
  ]);

  const announcementItems: NewsItem[] = announcements.slice(0, 6).map((a) => ({
    type: "announcement",
    id: String(a.postId),
    title: a.title,
    excerpt: a.content.replace(/<[^>]+>/g, "").slice(0, 100) + "…",
    imageUrl: a.imageUrls?.[0],
    href: `/support/announcements/${a.postId}`,
    linkLabel: "자세히보기 →",
  }));

  return (
    <NewsSectionClient
      announcements={announcementItems}
      mediumPosts={mediumPosts}
    />
  );
}
