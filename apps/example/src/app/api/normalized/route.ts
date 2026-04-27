import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return passIt({
    service: "json",
    path: "/posts/1",
    req,
    normalize: {
      success: true,
      error: true,
    },
  });
}
