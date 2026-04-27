import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default createMDX({})(nextConfig);
