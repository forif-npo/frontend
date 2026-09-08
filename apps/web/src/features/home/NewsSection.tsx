import { getAnnouncements } from "@/features/support/announcements/api/announcements.api";
import { NewsSectionClient } from "./NewsSectionClient";
import { toMediumNewsItems, type NewsItem } from "./news-items";

async function getMediumPosts(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/forif",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return toMediumNewsItems(await res.json());
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
    date: a.createdAt,
  }));

  return (
    <NewsSectionClient
      announcements={announcementItems}
      mediumPosts={mediumPosts}
    />
  );
}
