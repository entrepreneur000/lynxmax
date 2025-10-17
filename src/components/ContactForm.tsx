import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwybjab";

export const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        setMsg("Sent ✅ Thanks! We'll get back to you soon.");
        form.reset();
      } else {
        const j = await res.json().catch(() => ({}));
        setStatus("error");
        setMsg(j?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Your name
        </label>
        <Input
          id="name"
          name="name"
          required
          className="glass"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Your email
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          className="glass"
          placeholder="your.email@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          className="glass min-h-[150px]"
          placeholder="Tell us what's on your mind..."
        />
      </div>

      {/* Optional: subject + honeypot */}
      <input type="hidden" name="_subject" value="Lynxmax Contact" />
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary"
      >
        {status === "loading" ? (
          "Sending..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </Button>

      {status !== "idle" && (
        <div className={`text-sm ${
          status === "success" 
            ? "text-green-400" 
            : status === "error" 
            ? "text-red-400" 
            : "opacity-70"
        }`}>
          {msg}
        </div>
      )}
    </form>
  );
};
