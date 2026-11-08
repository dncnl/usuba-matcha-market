import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useAddToCart } from "@/hooks/useAddToCart";

export function ProductCard({ product, priority = false }: { product: ShopifyProduct; priority?: boolean }) {
  const { add, isLoading } = useAddToCart();
  const p = product.node;
  const image = p.images.edges[0]?.node;
  const firstVariant = p.variants.edges[0]?.node;
  const hasChoices = p.variants.edges.length > 1;

  return (
    <article className="group flex flex-col">
      <Link
        to="/product/$handle"
        params={{ handle: p.handle }}
        className="relative block overflow-hidden rounded-2xl bg-surface"
        aria-label={p.title}
      >
        {image && (
          <img
            src={`${image.url}&width=800`}
            alt={image.altText ?? p.title}
            width={800}
            height={800}
            loading={priority ? "eager" : "lazy"}
            className="aspect-square w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-calm)] group-hover:scale-[1.04]"
          />
        )}
        {p.productType && (
          <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground/70 backdrop-blur">
            {p.productType}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-2xl">
            <Link to="/product/$handle" params={{ handle: p.handle }} className="hover:text-primary">
              {p.title}
            </Link>
          </h3>
          <p className="shrink-0 text-sm tabular-nums text-foreground/80">
            {hasChoices && <span className="text-muted-foreground">from </span>}
            {formatMoney(p.priceRange.minVariantPrice)}
          </p>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-5 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => firstVariant && add(product, firstVariant)}
            disabled={isLoading || !firstVariant?.availableForSale}
            aria-label={`Add ${p.title}${hasChoices ? ` (${firstVariant?.title})` : ""} to cart`}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Add to cart"}
          </Button>
          {hasChoices && (
            <span className="text-xs text-muted-foreground">{firstVariant?.title}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-surface" />
          <div className="mt-5 h-6 w-2/3 rounded bg-surface" />
          <div className="mt-3 h-4 w-full rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}

export function EmptyProducts() {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
      <h3 className="text-2xl">No products found</h3>
      <p className="mt-2 text-sm text-muted-foreground">Check back soon — new harvests arrive each season.</p>
    </div>
  );
}
