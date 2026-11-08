import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Loader2, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cartTotals, useCartStore } from "@/stores/cartStore";
import { formatMoney, imageForOptions } from "@/lib/shopify";
import { QuantityStepper } from "./QuantityStepper";

export function CartDrawer() {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();
  const { count, subtotal, currencyCode } = cartTotals(items);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-full w-full flex-col border-l-border bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-6 text-left">
          <SheetTitle className="font-display text-3xl font-medium">Your cart</SheetTitle>
          <SheetDescription>
            {count === 0 ? "Your cart is empty" : `${count} item${count !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-muted-foreground">Nothing here yet.</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link to="/shop" search={{ collection: undefined }}>Browse the shop</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => {
                const img = imageForOptions(item.product, item.selectedOptions);
                const showVariant = item.variantTitle && item.variantTitle !== "Default Title";
                return (
                  <li key={item.variantId} className="flex gap-4 py-5">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                      {img && (
                        <img
                          src={`${img.url}&width=200`}
                          alt=""
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-display text-xl leading-tight">{item.product.node.title}</p>
                          {showVariant && <p className="text-xs text-muted-foreground">{item.variantTitle}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={`Remove ${item.product.node.title}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QuantityStepper
                          size="sm"
                          min={0}
                          value={item.quantity}
                          disabled={isLoading}
                          onChange={(q) => updateQuantity(item.variantId, q)}
                          label={`Quantity for ${item.product.node.title}`}
                        />
                        <p className="text-sm tabular-nums">
                          {formatMoney({
                            amount: parseFloat(item.price.amount) * item.quantity,
                            currencyCode: item.price.currencyCode,
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-4 border-t border-border bg-surface/60 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl tabular-nums">
                  {formatMoney({ amount: subtotal, currencyCode })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
                disabled={items.length === 0 || isLoading || isSyncing}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Checkout <ExternalLink />
                  </>
                )}
              </Button>
              <Button asChild variant="quiet" className="w-full" onClick={() => setOpen(false)}>
                <Link to="/cart">View full cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
