import { passIt } from "@pajarrahmansyah/passit";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return passIt({
    service: "axiosJson",
    path: "/todos/1",
    req,
    response: (data) => ({
      adapter: "axios",
      receivedAt: new Date().toISOString(),
      data,
    }),
  });
}
