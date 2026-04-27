import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  return passIt({
    service: "json",
    path: `/posts/${id}`,
    req,
    timeout: 2500,
    headers: {
      "x-route-feature": "dynamic-path",
    },
  });
}
