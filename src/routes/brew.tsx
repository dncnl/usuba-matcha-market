import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-matcha.jpg";
import latteImg from "@/assets/products/matcha-latte-blend.jpg";

export const Route = createFileRoute("/brew")({
  head: () => ({
    meta: [
      { title: "How to Brew Matcha — Usuba Matcha" },
      {
        name: "description",
        content: "A simple guide to whisking traditional usucha, thick koicha and a creamy matcha latte.",
      },
      { property: "og:title", content: "How to Brew Matcha — Usuba Matcha" },
      {
        property: "og:description",
        content: "Whisk usucha, koicha and a matcha latte in a few calm minutes.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Brew,
});

const TOOLS = [
  ["Chawan", "A wide bowl gives the whisk room to move."],
  ["Chasen", "A bamboo whisk creates fine, even foam."],
  ["Chashaku", "A bamboo scoop — one heaped scoop ≈ 1g."],
  ["Fine sieve", "Removes clumps for a silky cup."],
] as const;

const STEPS = [
  { t: "Warm the bowl", d: "Pour a little hot water into your chawan, soak the whisk tips for a moment, then discard the water and dry the bowl." },
  { t: "Sift the matcha", d: "Sift 2g (about 2 scoops or 1 tsp) of ceremonial matcha into the bowl to break up any clumps." },
  { t: "Add water", d: "Pour 70ml of water heated to 75–80°C. Boiling water scorches matcha and brings out bitterness." },
  { t: "Whisk", d: "Hold the bowl steady and whisk briskly from the wrist in an M or W shape for 15–20 seconds, until a fine, even foam forms." },
  { t: "Enjoy", d: "Lift the whisk gently from the centre to leave a soft peak. Drink straight from the bowl, slowly." },
];

const RECIPES = [
  { t: "Usucha", sub: "Thin tea", ratio: "2g · 70ml · 80°C", d: "The everyday bowl: light, frothy and gently sweet." },
  { t: "Koicha", sub: "Thick tea", ratio: "4g · 30ml · 80°C", d: "Kneaded slowly, not whisked — rich, glossy and intense. Ceremonial grade only." },
  { t: "Latte", sub: "Hot or iced", ratio: "2g · 30ml water · 180ml milk", d: "Whisk matcha with a splash of water first, then pour over steamed or iced milk." },
];

function Brew() {
  return (
    <>
      <section className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="eyebrow">Guide</p>
          <h1 className="mt-4 text-5xl leading-[1.04] md:text-7xl">How to brew</h1>
          <p className="mt-6 max-w-md text-lg text-foreground/75">
            Five calm minutes, four simple tools. Here's how to whisk a beautiful bowl of matcha at
            home.
          </p>
        </div>
        <img
          src={heroImg}
          alt="Whisking matcha in a stoneware bowl"
          width={1920}
          height={1088}
          className="aspect-[4/3] w-full rounded-2xl object-cover object-[75%_center]"
        />
      </section>

      <section className="border-y border-border bg-surface" aria-labelledby="tools">
        <div className="container-page py-20">
          <h2 id="tools" className="text-4xl">
            What you'll need
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map(([t, d]) => (
              <div key={t}>
                <dt className="font-display text-2xl">{t}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page py-24 md:py-32" aria-labelledby="steps">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Usucha, step by step</p>
            <h2 id="steps" className="mt-4 text-4xl md:text-5xl">
              The traditional bowl
            </h2>
          </div>
          <ol className="space-y-10 md:col-span-8">
            {STEPS.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border pt-8">
                <span className="font-display text-3xl text-primary">{i + 1}</span>
                <div>
                  <h3 className="text-3xl">{s.t}</h3>
                  <p className="mt-2 max-w-xl text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page" aria-labelledby="recipes">
        <h2 id="recipes" className="text-4xl md:text-5xl">
          Three ways to drink it
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {RECIPES.map((r) => (
            <div key={r.t} className="rounded-2xl border border-border bg-card p-8">
              <p className="eyebrow">{r.sub}</p>
              <h3 className="mt-3 text-4xl">{r.t}</h3>
              <p className="mt-4 text-sm font-medium tabular-nums">{r.ratio}</p>
              <p className="mt-3 text-sm text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pt-24 md:pt-32">
        <div className="grid items-center gap-12 overflow-hidden rounded-3xl bg-surface md:grid-cols-2">
          <img
            src={latteImg}
            alt="Iced matcha latte"
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <div className="p-8 md:p-12">
            <h2 className="text-4xl">Ready to begin?</h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Our Starter Kit has the whisk, scoop, bowl and 30g of ceremonial matcha — everything
              in this guide.
            </p>
            <Button asChild className="mt-8">
              <Link to="/product/$handle" params={{ handle: "matcha-starter-kit" }}>
                Shop the Starter Kit
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
