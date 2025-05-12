import type { MetadataRoute } from "next";

const BASE_URL = "https://forif.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/es`,
          de: `${BASE_URL}/de`,
        },
      },
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/es/about`,
          de: `${BASE_URL}/de/about`,
        },
      },
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      alternates: {
        languages: {
          es: `${BASE_URL}/es/blog`,
          de: `${BASE_URL}/de/blog`,
        },
      },
    },
  ];
}
