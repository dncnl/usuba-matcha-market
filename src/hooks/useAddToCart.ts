import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify";

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);

  const add = async (product: ShopifyProduct, variant: ShopifyVariant, quantity = 1) => {
    const ok = await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions ?? [],
    });
    if (ok) {
      const label =
        variant.title && variant.title !== "Default Title"
          ? `${product.node.title} · ${variant.title}`
          : product.node.title;
      toast.success("Added to your cart", { description: label, position: "top-center" });
      setOpen(true);
    } else {
      toast.error("Couldn't add to cart", {
        description: "Please try again in a moment.",
        position: "top-center",
      });
    }
  };

  return { add, isLoading };
}
