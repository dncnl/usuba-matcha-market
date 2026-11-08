import { Link } from "@tanstack/react-router";
import { Newsletter } from "./Newsletter";
import { Logo } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-surface">
      <div className="container-page grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">
            Shade-grown matcha and handmade teaware for a slower, more considered daily ritual.
          </p>
          <div className="mt-10">
            <p className="eyebrow">Harvest notes</p>
            <p className="mt-3 mb-5 max-w-sm text-sm text-muted-foreground">
              Seasonal releases, brewing tips and the occasional letter from Uji. No noise.
            </p>
            <Newsletter />
          </div>
        </div>

        <nav aria-label="Shop" className="md:col-span-2 md:col-start-8">
          <p className="eyebrow">Shop</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/shop" search={{}} className="hover:text-primary">All products</Link></li>
            <li><Link to="/shop" search={{ collection: "Matcha" }} className="hover:text-primary">Matcha</Link></li>
            <li><Link to="/shop" search={{ collection: "Teaware" }} className="hover:text-primary">Teaware</Link></li>
            <li><Link to="/shop" search={{ collection: "Kits" }} className="hover:text-primary">Kits</Link></li>
          </ul>
        </nav>

        <nav aria-label="Learn" className="md:col-span-2">
          <p className="eyebrow">Learn</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/brew" className="hover:text-primary">How to Brew</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Usuba Matcha</p>
          <p className="font-medium text-foreground/70">
            Demo store for portfolio purposes. Not a real business.
          </p>
        </div>
      </div>
    </footer>
  );
}
