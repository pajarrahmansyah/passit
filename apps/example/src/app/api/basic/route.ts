import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return passIt({
    service: "json",
    path: "/users",
    req,
    headers: {
      "x-route-feature": "basic-proxy",
    },
  });
}
