import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, EmptyProducts } from "@/components/store/ProductCard";
import { Newsletter } from "@/components/site/Newsletter";
import { productsQueryOptions } from "@/lib/shopify";
import heroImg from "@/assets/hero-matcha.jpg";
import fieldsImg from "@/assets/tea-fields.jpg";
import kitImg from "@/assets/products/starter-kit.jpg";
import bowlsImg from "@/assets/products/chawan-all.jpg";
import matchaImg from "@/assets/products/ceremonial-matcha.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Usuba Matcha — Shade-grown ceremonial matcha from Uji" },
      {
        name: "description",
        content:
          "Stone-ground ceremonial matcha, handmade chawan and bamboo whisks. Calm, premium matcha for a daily ritual.",
      },
      { property: "og:title", content: "Usuba Matcha — Shade-grown ceremonial matcha" },
      {
        property: "og:description",
        content: "Stone-ground ceremonial matcha and handmade teaware for a daily ritual.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Home,
});

const COLLECTION_TILES = [
  { name: "Matcha", img: matchaImg, copy: "Ceremonial, culinary & latte" },
  { name: "Teaware", img: bowlsImg, copy: "Chawan & bamboo chasen" },
  { name: "Kits", img: kitImg, copy: "Everything to begin" },
] as const;

function Home() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const bestSellers = products.filter((p) => p.node.tags.includes("best-seller")).slice(0, 4);
  const featured = bestSellers.length ? bestSellers : products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="A hand whisking bright green matcha in a stoneware bowl"
            width={1920}
            height={1088}
            fetchPriority="high"
            className="h-full w-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/0 md:via-background/60" />
        </div>
        <div className="container-page relative flex min-h-[78svh] items-center py-24 md:min-h-[86svh]">
          <div className="max-w-xl fade-up">
            <p className="eyebrow">First harvest · Uji, Kyoto</p>
            <h1 className="mt-6 text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
              A quieter kind <br className="hidden sm:block" />
              of <em className="font-normal text-primary">energy.</em>
            </h1>
            <p className="mt-6 max-w-md text-base text-foreground/75 md:text-lg">
              Shade-grown, stone-ground matcha and handmade teaware — for a few calm minutes,
              every morning.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button asChild size="lg">
                <Link to="/shop" search={{ collection: undefined }}>
                  Shop matcha <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="quiet">
                <Link to="/brew">How to brew</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="container-page py-24 md:py-32" aria-labelledby="best-sellers">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2 id="best-sellers" className="mt-4 text-4xl md:text-5xl">
              Most-loved in the ritual
            </h2>
          </div>
          <Button asChild variant="quiet">
            <Link to="/shop" search={{ collection: undefined }}>View all products</Link>
          </Button>
        </div>
        <div className="mt-14">
          {featured.length === 0 ? (
            <EmptyProducts />
          ) : (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p, i) => (
                <ProductCard key={p.node.id} product={p} priority={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="container-page" aria-labelledby="collections">
        <h2 id="collections" className="sr-only">
          Collections
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {COLLECTION_TILES.map((c) => (
            <Link
              key={c.name}
              to="/shop"
              search={{ collection: c.name }}
              className="group relative block overflow-hidden rounded-2xl bg-surface"
            >
              <img
                src={c.img}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-calm)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/55 to-foreground/0 p-7 pt-24">
                <p className="font-display text-4xl text-background">{c.name}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-background/85">
                  {c.copy} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="container-page py-24 md:py-36" aria-labelledby="story">
        <div className="grid items-center gap-14 md:grid-cols-12">
          <div className="overflow-hidden rounded-2xl md:col-span-7">
            <img
              src={fieldsImg}
              alt="Terraced tea fields in morning mist"
              width={1536}
              height={1024}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="md:col-span-5 md:pl-6">
            <p className="eyebrow">Our story</p>
            <h2 id="story" className="mt-4 text-4xl md:text-5xl">
              Grown in shade. <br />
              Ground in stone.
            </h2>
            <div className="prose-calm mt-6">
              <p>
                <em>Usuba</em> means “thin blade” — a nod to the careful, unhurried craft behind
                every tin. Our leaves are shaded for weeks before the spring harvest, deepening
                their colour and sweetness.
              </p>
              <p>
                They're then de-veined and slowly stone-milled, a few grams an hour, so the
                powder stays cool, fragrant and impossibly fine.
              </p>
            </div>
            <Button asChild variant="quiet" className="mt-8">
              <Link to="/about">Read our story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ritual strip */}
      <section className="border-y border-border bg-surface" aria-labelledby="ritual">
        <div className="container-page grid gap-12 py-20 md:grid-cols-3 md:py-24">
          <h2 id="ritual" className="sr-only">
            The ritual
          </h2>
          {[
            { n: "01", t: "Sift", d: "2g of matcha through a fine sieve into a warm bowl." },
            { n: "02", t: "Pour", d: "70ml of water at 75–80°C — never boiling." },
            { n: "03", t: "Whisk", d: "Brisk M-shaped strokes for 15 seconds, until frothy." },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-display text-xl text-primary">{s.n}</p>
              <p className="mt-3 font-display text-3xl">{s.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page pt-24 md:pt-32" aria-labelledby="newsletter">
        <div className="rounded-3xl bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/70">
                Harvest notes
              </p>
              <h2 id="newsletter" className="mt-4 text-4xl md:text-5xl">
                Letters from the tea fields
              </h2>
              <p className="mt-4 max-w-md text-primary-foreground/80">
                Seasonal releases and brewing tips, a few times a year.
              </p>
            </div>
            <div className="md:justify-self-end">
              <Newsletter tone="dark" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
