import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2026-10";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "usuba-matcha-shop-djkwt-m01rwpb4.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
// Storefront tokens are public by design (read-only catalog + cart access).
export const SHOPIFY_STOREFRONT_TOKEN = "f46836ae2dea9912da4736ced3658d17";

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml?: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: { minVariantPrice: Money };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: { edges: Array<{ node: ShopifyVariant }> };
    options: Array<{ name: string; values: string[] }>;
  };
}

const PRODUCT_FIELDS = `
  id
  title
  description
  descriptionHtml
  handle
  productType
  tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 6) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: CREATED_AT) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

export async function fetchProducts(query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50, query: query ?? null });
  return (data?.data?.products?.edges ?? []) as ShopifyProduct[];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const node = data?.data?.product;
  return node ? ({ node } as ShopifyProduct) : null;
}

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: ["shopify", "products"],
    queryFn: () => fetchProducts(),
    staleTime: 60_000,
  });

export const productQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ["shopify", "product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 60_000,
  });

export const COLLECTIONS = ["Matcha", "Teaware", "Kits"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export function formatMoney(money: Money | { amount: number; currencyCode: string }) {
  const amount = typeof money.amount === "string" ? parseFloat(money.amount) : money.amount;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: money.currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  } catch {
    return `${money.currencyCode} ${amount.toFixed(2)}`;
  }
}

/** Pick the product image whose alt text matches a selected option value (e.g. "Sage"). */
export function imageForOptions(
  product: ShopifyProduct,
  options: Array<{ name: string; value: string }>,
) {
  const images = product.node.images.edges.map((e) => e.node);
  const match = images.find((img) =>
    options.some((o) => img.altText?.toLowerCase() === o.value.toLowerCase()),
  );
  return match ?? images[0];
}
