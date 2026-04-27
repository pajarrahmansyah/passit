import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return passIt({
    service: "httpbin",
    path: "/html",
    req,
    normalize: false,
    response: (html) => ({
      contentType: "html",
      characters: typeof html === "string" ? html.length : 0,
      sample: typeof html === "string" ? html.replace(/\s+/g, " ").slice(0, 220) : html,
    }),
  });
}
