import { describe, expect, it } from "@jest/globals";
import { toMediumNewsItems } from "./news-items";

describe("toMediumNewsItems", () => {
  it("converts a valid RSS item into the existing news card shape", () => {
    expect(
      toMediumNewsItems({
        items: [
          {
            guid: "medium-guid",
            link: "https://medium.com/forif/post",
            title: "FORIF 기술 블로그",
            description:
              '<p>본문입니다.</p><img src="https://example.com/image.png">',
            pubDate: "2026-09-08T00:00:00.000Z",
          },
        ],
      }),
    ).toEqual([
      {
        type: "medium",
        id: "medium-guid",
        title: "FORIF 기술 블로그",
        excerpt: "본문입니다.…",
        imageUrl: "https://example.com/image.png",
        href: "https://medium.com/forif/post",
        date: "2026-09-08T00:00:00.000Z",
      },
    ]);
  });

  it("uses thumbnail and enclosure images in the existing priority order", () => {
    expect(
      toMediumNewsItems({
        items: [
          {
            link: "https://medium.com/forif/thumbnail",
            title: "thumbnail",
            thumbnail: "https://example.com/thumbnail.png",
            enclosure: { link: "https://example.com/enclosure.png" },
          },
          {
            link: "https://medium.com/forif/enclosure",
            title: "enclosure",
            enclosure: { link: "https://example.com/enclosure.png" },
          },
        ],
      }).map((item) => item.imageUrl),
    ).toEqual([
      "https://example.com/thumbnail.png",
      "https://example.com/enclosure.png",
    ]);
  });

  it("ignores malformed feed values and items without a destination link", () => {
    expect(toMediumNewsItems({ items: "invalid" })).toEqual([]);
    expect(
      toMediumNewsItems({
        items: [null, { title: "링크 없음" }, { link: 42 }, { link: "/valid" }],
      }),
    ).toEqual([
      {
        type: "medium",
        id: "/valid",
        title: "",
        excerpt: "",
        href: "/valid",
      },
    ]);
  });
});
