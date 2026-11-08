import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard, EmptyProducts } from "@/components/store/ProductCard";
import { COLLECTIONS, productsQueryOptions, type Collection } from "@/lib/shopify";
import { cn } from "@/lib/utils";

const COPY: Record<Collection | "All", string> = {
  All: "Matcha, teaware and kits — everything for the daily bowl.",
  Matcha: "Shade-grown, stone-ground powders for whisking, lattes and baking.",
  Teaware: "Handmade chawan and bamboo whisks, made to be used every day.",
  Kits: "Thoughtfully gathered sets to begin — or to give.",
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { collection?: Collection } => {
    const c = search.collection;
    return typeof c === "string" && (COLLECTIONS as readonly string[]).includes(c)
      ? { collection: c as Collection }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Shop matcha & teaware — Usuba Matcha" },
      {
        name: "description",
        content: "Browse ceremonial and culinary matcha, handmade chawan, bamboo whisks and starter kits.",
      },
      { property: "og:title", content: "Shop — Usuba Matcha" },
      {
        property: "og:description",
        content: "Ceremonial matcha, handmade teaware and starter kits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Shop,
});

function Shop() {
  const { collection } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const filtered = collection ? products.filter((p) => p.node.productType === collection) : products;
  const tabs: Array<Collection | undefined> = [undefined, ...COLLECTIONS];

  return (
    <div className="container-page py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow">The shop</p>
        <h1 className="mt-4 text-5xl md:text-6xl">{collection ?? "All products"}</h1>
        <p className="mt-4 text-muted-foreground">{COPY[collection ?? "All"]}</p>
      </header>

      <nav aria-label="Collections" className="mt-12 -mx-1 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((c) => {
          const active = c === collection;
          const count = c ? products.filter((p) => p.node.productType === c).length : products.length;
          return (
            <Link
              key={c ?? "all"}
              to="/shop"
              search={c ? { collection: c } : {}}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-full border px-5 py-2 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/15 text-foreground/75 hover:border-foreground/40",
              )}
            >
              {c ?? "All"} <span className="ml-1 opacity-60 tabular-nums">{count}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-14">
        {filtered.length === 0 ? (
          <EmptyProducts />
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.node.id} product={p} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
