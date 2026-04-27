import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return passIt({
    service: "httpbin",
    path: "/status/503",
    req,
    timeout: 1500,
    retry: {
      times: 2,
      onStatus: [500, 502, 503],
    },
    normalize: {
      success: true,
      error: true,
    },
    hooks: {
      onError: (err) =>
        console.error(`[passit route override] ${err.status} ${err.path}: ${err.message}`),
    },
  });
}
