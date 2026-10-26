 "use client";

import { useState } from "react";

export function NewsletterForm({ locale }: { locale: "az" | "en" }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const az = locale === "az";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      az
        ? "Demo rejimi: newsletter backend-i hələ qoşulmayıb."
        : "Demo mode: the newsletter backend is not connected yet."
    );
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="sr-only" htmlFor={`newsletter-${locale}`}>Email</label>
      <input
        id={`newsletter-${locale}`}
        type="email"
        placeholder={az ? "E-poçt ünvanın" : "Your email address"}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit">{az ? "Abunə ol ↗" : "Subscribe ↗"}</button>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>
  );
}
