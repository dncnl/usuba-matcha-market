import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import fieldsImg from "@/assets/tea-fields.jpg";
import bowlsImg from "@/assets/products/chawan-all.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Usuba Matcha" },
      {
        name: "description",
        content: "The story behind Usuba Matcha: shade-grown leaves, slow stone-milling and handmade teaware.",
      },
      { property: "og:title", content: "About Usuba Matcha" },
      {
        property: "og:description",
        content: "Shade-grown leaves, slow stone-milling and handmade teaware.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  {
    t: "Shade-grown",
    d: "Tea bushes are covered for three to four weeks before harvest, raising chlorophyll and L-theanine for a sweeter, greener cup.",
  },
  {
    t: "Stone-milled",
    d: "Granite mills turn slowly — around 40 grams an hour — so the leaf never heats up and keeps its fragrance.",
  },
  {
    t: "Small batch",
    d: "We work with a handful of family growers and pack in small lots, so every tin is fresh.",
  },
];

function About() {
  return (
    <>
      <section className="container-page py-16 md:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-5xl leading-[1.04] md:text-7xl">
            The craft of a <em className="font-normal text-primary">thin blade.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-foreground/75">
            Usuba is the Japanese word for a fine, thin knife — a tool made for precision and
            patience. It's how we think about matcha: a few careful steps, done slowly and well.
          </p>
        </div>
      </section>

      <div className="container-page">
        <img
          src={fieldsImg}
          alt="Misty terraced tea fields at dawn"
          width={1536}
          height={1024}
          className="aspect-[16/9] w-full rounded-2xl object-cover md:aspect-[21/9]"
        />
      </div>

      <section className="container-page grid gap-12 py-24 md:grid-cols-3 md:py-32">
        {VALUES.map((v, i) => (
          <div key={v.t}>
            <p className="font-display text-xl text-primary">0{i + 1}</p>
            <h2 className="mt-3 text-3xl">{v.t}</h2>
            <p className="mt-3 text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </section>

      <section className="container-page grid items-center gap-14 md:grid-cols-2">
        <div className="prose-calm order-2 md:order-1">
          <p className="eyebrow">Teaware</p>
          <h2 className="mt-4 text-4xl text-foreground md:text-5xl">Made by hand, meant for use</h2>
          <p className="mt-6">
            Our chawan are wheel-thrown in small studios and glazed in three quiet tones —
            Stone, Sage and Charcoal. No two are quite alike.
          </p>
          <p>
            Each chasen is carved from a single piece of bamboo, split into around a hundred fine
            prongs that whisk matcha into a soft, glossy foam.
          </p>
          <Button asChild className="mt-8">
            <Link to="/shop" search={{ collection: "Teaware" }}>Shop teaware</Link>
          </Button>
        </div>
        <img
          src={bowlsImg}
          alt="Three handmade matcha bowls in stone, sage and charcoal glazes"
          width={1024}
          height={1024}
          loading="lazy"
          className="order-1 aspect-square w-full rounded-2xl object-cover md:order-2"
        />
      </section>
    </>
  );
}
