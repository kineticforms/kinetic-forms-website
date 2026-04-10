import { useState } from "react";

interface Props {
  variant?: "light" | "dark";
}

export default function NewsletterForm({ variant = "light" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        if (typeof window !== "undefined" && (window as any).posthog) {
          (window as any).posthog.capture("newsletter_subscribe");
        }
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something broke. Try again in a moment.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something broke. Try again in a moment.");
    }
  };

  if (status === "success") {
    return (
      <p className={variant === "dark" ? "text-zinc-400 text-sm" : "text-zinc-500 text-sm"}>
        You're in. Check your inbox.
      </p>
    );
  }

  const inputBg = variant === "dark"
    ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
    : "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder:text-zinc-500";

  const btnStyle = variant === "dark"
    ? "bg-white text-black hover:-translate-y-0.5"
    : "bg-black text-white dark:bg-white dark:text-black hover:-translate-y-0.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading"}
        className={`flex-1 px-4 py-3 min-h-[44px] rounded-full border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white ${inputBg} ${status === "loading" ? "opacity-50" : ""}`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-6 py-3 min-h-[44px] rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white ring-offset-2 ${btnStyle} ${status === "loading" ? "opacity-50" : ""}`}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-red-500 text-sm sm:col-span-2 mt-1">{errorMsg}</p>
      )}
    </form>
  );
}
