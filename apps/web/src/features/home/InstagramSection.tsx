import {
  InstagramSectionClient,
  type InstagramPost,
} from "./InstagramSectionClient";

const INSTAGRAM_MEDIA_FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "like_count",
  "comments_count",
].join(",");

type InstagramMediaResponse = {
  data?: Array<{
    id: string;
    caption?: string;
    media_type?: "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO";
    media_url?: string;
    thumbnail_url?: string;
    permalink?: string;
    timestamp?: string;
    like_count?: number;
    comments_count?: number;
  }>;
};

/**
 * Meta의 Instagram API로 최근 게시물을 가져온다.
 *
 * `INSTAGRAM_USER_ID`와 `INSTAGRAM_ACCESS_TOKEN`은 서버 환경 변수로만 설정한다.
 * media_url은 만료될 수 있으므로 짧게 캐시하고, 실패하면 프로필 링크 안내를 노출한다.
 */
async function getInstagramPosts(): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID ?? "me";

  if (!accessToken) return [];

  const params = new URLSearchParams({
    fields: INSTAGRAM_MEDIA_FIELDS,
    limit: "15",
    access_token: accessToken,
  });

  try {
    const response = await fetch(
      `https://graph.instagram.com/${userId}/media?${params.toString()}`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as InstagramMediaResponse;

    return (data.data ?? [])
      .filter(
        (post) => post.permalink && (post.media_url || post.thumbnail_url),
      )
      .slice(0, 15)
      .map((post) => ({
        id: post.id,
        caption: post.caption ?? "FORIF의 새로운 소식을 확인해 보세요.",
        imageUrl: post.thumbnail_url ?? post.media_url!,
        permalink: post.permalink!,
        mediaType: post.media_type ?? "IMAGE",
        likeCount: post.like_count ?? 0,
        commentsCount: post.comments_count ?? 0,
      }));
  } catch {
    return [];
  }
}

export async function InstagramSection() {
  const posts = await getInstagramPosts();

  return <InstagramSectionClient posts={posts} />;
}
