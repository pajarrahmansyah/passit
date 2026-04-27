import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export async function GET(req: NextRequest) {
  return passIt({
    service: "json",
    path: "/posts",
    req,
    normalize: false,
    response: (data) => {
      const posts = Array.isArray(data) ? (data as Post[]) : [];

      return {
        count: posts.length,
        preview: posts.slice(0, 5).map((post) => ({
          id: post.id,
          owner: `user-${post.userId}`,
          title: post.title,
          excerpt: post.body.slice(0, 96),
        })),
      };
    },
  });
}
