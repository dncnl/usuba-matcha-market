import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What's the difference between ceremonial and culinary matcha?",
    a: "Ceremonial matcha is made from the youngest first-harvest leaves and is smooth and sweet enough to drink with water alone. Culinary matcha comes from later harvests; it's bolder and holds its flavour in lattes, smoothies and baking.",
  },
  {
    q: "How much caffeine is in matcha?",
    a: "A typical 2g serving has roughly 60–70mg of caffeine — a little less than an espresso. Matcha's natural L-theanine tends to make the energy feel calmer and longer-lasting.",
  },
  {
    q: "How should I store my matcha?",
    a: "Keep the tin sealed, away from light and heat. Once opened, store it in the fridge and enjoy within 4–6 weeks for the brightest colour and flavour.",
  },
  {
    q: "Why is my matcha bitter?",
    a: "Usually the water is too hot. Use water at 75–80°C, sift the powder first, and whisk briskly rather than stirring. See our How to Brew guide for step-by-step tips.",
  },
  {
    q: "How do I care for my bamboo whisk?",
    a: "Soak the tips in warm water before use, rinse with plain water afterwards (no soap), and let it dry upright — ideally on a whisk holder — so the prongs keep their shape.",
  },
  {
    q: "Are the chawan dishwasher safe?",
    a: "They are, but we recommend hand-washing to protect the handmade glaze. Each bowl is unique, so small variations in colour and texture are part of its character.",
  },
  {
    q: "Where do you ship?",
    a: "This is a demo store for portfolio purposes, so orders aren't fulfilled. In a live store, shipping options and rates would be shown at checkout.",
  },
  {
    q: "Is Usuba Matcha a real company?",
    a: "No — Usuba Matcha is a made-up brand created as a portfolio demo. Products, prices and stories are illustrative.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Usuba Matcha" },
      {
        name: "description",
        content: "Answers about matcha grades, caffeine, storage, brewing, teaware care and shipping.",
      },
      { property: "og:title", content: "Frequently asked questions — Usuba Matcha" },
      { property: "og:description", content: "Matcha grades, caffeine, storage, brewing and teaware care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <div className="container-page grid gap-14 py-16 md:grid-cols-12 md:py-24">
      <header className="md:col-span-4">
        <p className="eyebrow">Help</p>
        <h1 className="mt-4 text-5xl md:text-6xl">Questions, answered</h1>
        <p className="mt-6 text-muted-foreground">
          Still curious? Our{" "}
          <Link to="/brew" className="text-primary underline underline-offset-4">
            brewing guide
          </Link>{" "}
          covers the ritual step by step.
        </p>
      </header>
      <Accordion type="single" collapsible className="md:col-span-8">
        {FAQS.map((f, i) => (
          <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="py-6 text-left font-display text-2xl font-medium hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
