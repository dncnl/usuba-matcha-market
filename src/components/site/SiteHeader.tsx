import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cartTotals, useCartStore } from "@/stores/cartStore";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/brew", label: "How to Brew" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="group inline-flex items-baseline gap-2" aria-label="Usuba Matcha home">
      <span className="font-display text-[1.7rem] font-medium leading-none tracking-tight">Usuba</span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-primary">Matcha</span>
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setOpen = useCartStore((s) => s.setOpen);
  const { count } = cartTotals(items);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <button
          type="button"
          className="-ml-2 rounded-full p-2 md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative -mr-2 rounded-full p-2 transition-colors hover:text-primary"
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[85%] max-w-sm bg-background px-8 pt-16">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <nav aria-label="Mobile" className="flex flex-col gap-6">
            <Link to="/" onClick={() => setMenuOpen(false)} className="font-display text-3xl">
              Home
            </Link>
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl"
                activeProps={{ className: "text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
