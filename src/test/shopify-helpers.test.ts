import { describe, expect, it } from "vitest";
import { imageForOptions, type ShopifyProduct } from "@/lib/shopify";

const bowl = {
  node: {
    images: {
      edges: [
        { node: { url: "https://cdn.test/all.jpg", altText: "All three bowls" } },
        { node: { url: "https://cdn.test/stone.jpg", altText: "Stone" } },
        { node: { url: "https://cdn.test/sage.jpg", altText: "Sage" } },
      ],
    },
  },
} as unknown as ShopifyProduct;

describe("imageForOptions", () => {
  it("shows the Sage photo when the Sage bowl is chosen", () => {
    expect(imageForOptions(bowl, [{ name: "Color", value: "Sage" }])?.url).toBe("https://cdn.test/sage.jpg");
  });

  it("falls back to the first photo when no image matches the option", () => {
    expect(imageForOptions(bowl, [{ name: "Size", value: "30g" }])?.url).toBe("https://cdn.test/all.jpg");
  });
});
