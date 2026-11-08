import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/store/QuantityStepper";
import { cartTotals, useCartStore } from "@/stores/cartStore";
import { formatMoney, imageForOptions, sizedImage } from "@/lib/shopify";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Usuba Matcha" },
      { name: "description", content: "Review your matcha and teaware before secure Shopify checkout." },
      { property: "og:title", content: "Your cart — Usuba Matcha" },
      { property: "og:description", content: "Review your items before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl } = useCartStore();
  const { count, subtotal, currencyCode } = cartTotals(items);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="container-page py-16 md:py-24">
      <p className="eyebrow">Cart</p>
      <h1 className="mt-4 text-5xl md:text-6xl">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <p className="font-display text-3xl">Your cart is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">Begin with a tin of ceremonial matcha.</p>
          <Button asChild className="mt-8">
            <Link to="/shop" search={{}}>Browse the shop</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          <ul className="divide-y divide-border border-y border-border lg:col-span-8">
            {items.map((item) => {
              const img = imageForOptions(item.product, item.selectedOptions);
              const showVariant = item.variantTitle && item.variantTitle !== "Default Title";
              return (
                <li key={item.variantId} className="flex gap-5 py-7 sm:gap-7">
                  <Link
                    to="/product/$handle"
                    params={{ handle: item.product.node.handle }}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-32 sm:w-32"
                  >
                    {img && (
                      <img
                        src={sizedImage(img.url, 300)}
                        alt={item.product.node.title}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to="/product/$handle"
                          params={{ handle: item.product.node.handle }}
                          className="font-display text-2xl hover:text-primary"
                        >
                          {item.product.node.title}
                        </Link>
                        {showVariant && <p className="text-sm text-muted-foreground">{item.variantTitle}</p>}
                        <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                          {formatMoney(item.price)} each
                        </p>
                      </div>
                      <p className="tabular-nums">
                        {formatMoney({
                          amount: parseFloat(item.price.amount) * item.quantity,
                          currencyCode: item.price.currencyCode,
                        })}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center gap-5 pt-4">
                      <QuantityStepper
                        size="sm"
                        min={0}
                        value={item.quantity}
                        disabled={isLoading}
                        onChange={(q) => updateQuantity(item.variantId, q)}
                        label={`Quantity for ${item.product.node.title}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="lg:col-span-4" aria-label="Order summary">
            <div className="rounded-2xl bg-surface p-8 lg:sticky lg:top-28">
              <h2 className="text-3xl">Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd className="tabular-nums">{count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>Calculated at checkout</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-4 text-base">
                  <dt>Subtotal</dt>
                  <dd className="font-display text-2xl tabular-nums">
                    {formatMoney({ amount: subtotal, currencyCode })}
                  </dd>
                </div>
              </dl>
              <Button className="mt-8 w-full" size="lg" onClick={checkout} disabled={isLoading || isSyncing}>
                {isLoading || isSyncing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Checkout <ExternalLink />
                  </>
                )}
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Secure checkout by Shopify opens in a new tab.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
