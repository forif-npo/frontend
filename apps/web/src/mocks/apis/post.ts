import { delay, http, HttpResponse } from "msw";

export const getPosts = http.get("https://api.forif.org/posts", async () => {
  return HttpResponse.json({
    data: {
      posts: [
        { id: "1", title: "First Post" },
        { id: "2", title: "Second Post" },
        { id: "3", title: "Third Post" },
        { id: "4", title: "Fourth Post" },
      ],
    },
  });
});
