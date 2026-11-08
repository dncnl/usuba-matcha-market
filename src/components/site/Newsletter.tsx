import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const dark = tone === "dark";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value) || value.length > 254) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <p
        role="status"
        className={cn("flex items-center gap-2 text-sm", dark ? "text-primary-foreground" : "text-primary")}
      >
        <Check className="h-4 w-4" /> Thank you — you're on the list for harvest notes.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor={`newsletter-${tone}`} className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border p-1.5 pl-5 transition-colors",
          dark
            ? "border-primary-foreground/30 focus-within:border-primary-foreground/70"
            : "border-foreground/20 bg-card focus-within:border-primary",
        )}
      >
        <input
          id={`newsletter-${tone}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `newsletter-${tone}-error` : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-sm outline-none",
            dark ? "text-primary-foreground placeholder:text-primary-foreground/60" : "placeholder:text-muted-foreground",
          )}
          style={{ outline: "none" }}
        />
        <Button type="submit" size="sm" variant={dark ? "secondary" : "default"}>
          Subscribe
        </Button>
      </div>
      {error && (
        <p
          id={`newsletter-${tone}-error`}
          className={cn("mt-2 pl-5 text-xs", dark ? "text-primary-foreground" : "text-destructive")}
        >
          {error}
        </p>
      )}
    </form>
  );
}
