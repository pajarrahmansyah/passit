import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return passIt({
    service: "httpbin",
    path: "/headers",
    req,
    headers: {
      "x-route-feature": "header-merge",
      "x-passit-app": "route-header-wins",
    },
    normalize: true,
  });
}
