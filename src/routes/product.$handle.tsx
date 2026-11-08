import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/store/QuantityStepper";
import { ProductCard } from "@/components/store/ProductCard";
import { useAddToCart } from "@/hooks/useAddToCart";
import {
  formatMoney,
  imageForOptions,
  productQueryOptions,
  productsQueryOptions,
  sizedImage,
} from "@/lib/shopify";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const [product] = await Promise.all([
      context.queryClient.ensureQueryData(productQueryOptions(params.handle)),
      context.queryClient.ensureQueryData(productsQueryOptions()),
    ]);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — Usuba Matcha" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.node;
    const desc = p.description.slice(0, 155);
    const img = p.images.edges[0]?.node.url;
    const ogImg = img
      ? (() => {
          const u = new URL(img);
          u.searchParams.set("width", "1200");
          u.searchParams.set("height", "630");
          u.searchParams.set("crop", "center");
          return u.toString();
        })()
      : null;
    return {
      meta: [
        { title: `${p.title} — Usuba Matcha` },
        { name: "description", content: desc },
        { property: "og:title", content: `${p.title} — Usuba Matcha` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(ogImg
          ? [
              { property: "og:image", content: ogImg },
              { name: "twitter:image", content: ogImg },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-5xl">Product not found</h1>
      <p className="mt-4 text-muted-foreground">This item may have sold out or moved.</p>
      <Button asChild className="mt-8">
        <Link to="/shop" search={{}}>Back to the shop</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(productQueryOptions(handle));
  const { data: all } = useSuspenseQuery(productsQueryOptions());
  const product = data!;
  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const realOptions = p.options.filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"));

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((variants[0]?.selectedOptions ?? []).map((o) => [o.name, o.value])),
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { add, isLoading } = useAddToCart();

  const variant = useMemo(
    () =>
      variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? variants[0],
    [variants, selected],
  );

  const images = p.images.edges.map((e) => e.node);
  const variantImage = imageForOptions(product, variant?.selectedOptions ?? []);
  const mainImage = images.find((i) => i.url === activeImage) ?? variantImage;

  const related = all
    .filter((x) => x.node.handle !== p.handle)
    .sort((a, b) => Number(b.node.productType === p.productType) - Number(a.node.productType === p.productType))
    .slice(0, 3);

  return (
    <>
      <div className="container-page pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link
            to="/shop"
            search={p.productType ? { collection: p.productType as "Matcha" } : {}}
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" /> {p.productType || "Shop"}
          </Link>
        </nav>
      </div>

      <section className="container-page grid gap-12 pt-8 md:grid-cols-2 md:gap-16 lg:gap-24">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-surface">
            {mainImage && (
              <img
                src={sizedImage(mainImage.url, 1200)}
                alt={mainImage.altText && mainImage.altText.length > 12 ? mainImage.altText : `${p.title}${variant && variant.title !== "Default Title" ? ` in ${variant.title}` : ""}`}
                width={1200}
                height={1200}
                fetchPriority="high"
                className="aspect-square w-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img) => {
                const isActive = img.url === mainImage?.url;
                return (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setActiveImage(img.url)}
                    aria-label={`Show image: ${img.altText ?? p.title}`}
                    aria-pressed={isActive}
                    className={cn(
                      "overflow-hidden rounded-xl border-2 bg-surface transition-colors",
                      isActive ? "border-primary" : "border-transparent hover:border-foreground/20",
                    )}
                  >
                    <img
                      src={sizedImage(img.url, 300)}
                      alt=""
                      width={300}
                      height={300}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow">{p.productType}</p>
          <h1 className="mt-4 text-5xl md:text-6xl">{p.title}</h1>
          <p className="mt-5 font-display text-3xl tabular-nums" aria-live="polite">
            {variant && formatMoney(variant.price)}
          </p>

          {realOptions.map((opt) => (
            <fieldset key={opt.name} className="mt-9">
              <legend className="text-sm font-medium">
                {opt.name}: <span className="font-normal text-muted-foreground">{selected[opt.name]}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const isSel = selected[opt.name] === val;
                  const candidate = variants.find((v) =>
                    v.selectedOptions.every((o) => (o.name === opt.name ? o.value === val : selected[o.name] === o.value)),
                  );
                  const unavailable = !candidate?.availableForSale;
                  return (
                    <label
                      key={val}
                      className={cn(
                        "cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                        isSel
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-foreground/20 hover:border-foreground/50",
                        unavailable && "opacity-50 line-through",
                      )}
                    >
                      <input
                        type="radio"
                        name={opt.name}
                        value={val}
                        checked={isSel}
                        onChange={() => {
                          setSelected((s) => ({ ...s, [opt.name]: val }));
                          setActiveImage(null);
                        }}
                        className="sr-only"
                      />
                      {val}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="mt-9">
            <p className="text-sm font-medium" id="qty-label">
              Quantity
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <QuantityStepper value={quantity} onChange={setQuantity} label="Quantity" />
              <Button
                size="lg"
                className="h-12 flex-1"
                disabled={isLoading || !variant?.availableForSale}
                onClick={() => variant && add(product, variant, quantity)}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : variant?.availableForSale ? (
                  <>Add to cart · {variant && formatMoney({ amount: parseFloat(variant.price.amount) * quantity, currencyCode: variant.price.currencyCode })}</>
                ) : (
                  "Sold out"
                )}
              </Button>
            </div>
          </div>

          <div
            className="prose-calm mt-12 border-t border-border pt-10 text-[0.95rem]"
            // Description HTML is authored in this store's own Shopify admin.
            dangerouslySetInnerHTML={{ __html: p.descriptionHtml || p.description }}
          />

          <div className="mt-10 rounded-2xl bg-surface p-6 text-sm text-muted-foreground">
            New to matcha?{" "}
            <Link to="/brew" className="text-primary underline underline-offset-4">
              Read our brewing guide
            </Link>
            .
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page pt-28 md:pt-36" aria-labelledby="related">
          <h2 id="related" className="text-4xl">
            You may also like
          </h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ProductCard key={r.node.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
