"use client";

import { useState } from "react";

type AboutValue = { number?: number; title: string; text: string };
type AboutData = { greeting: string; lead: string; values: AboutValue[] };
const blank: AboutData = { greeting: "", lead: "", values: [{ title: "", text: "" }, { title: "", text: "" }, { title: "", text: "" }] };

export default function AboutEditor({ initialData }: { initialData: Record<string, AboutData> }) {
  const [locale, setLocale] = useState<"az" | "en">("az");
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState<AboutData>(initialData.az || blank);
  const [message, setMessage] = useState("");
  function switchLocale(value: "az" | "en") { setLocale(value); setForm(data[value] || blank); setMessage(""); }
  function update(key: keyof AboutData, value: string) { setForm((old) => ({ ...old, [key]: value })); }
  function updateValue(index: number, key: "title" | "text", value: string) { setForm((old) => ({ ...old, values: old.values.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) })); }
  async function save(event: React.FormEvent) { event.preventDefault(); const response = await fetch("/api/admin/about", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, ...form }) }); const result = await response.json(); if (!response.ok) { setMessage(result.error || "Xəta baş verdi."); return; } setData((old) => ({ ...old, [locale]: form })); setMessage("About məzmunu yadda saxlanıldı."); }
  async function remove() { if (!confirm("Bu dil üçün About məzmunu silinsin?")) return; await fetch("/api/admin/about", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale }) }); setData((old) => { const next = { ...old }; delete next[locale]; return next; }); setForm(blank); setMessage("About məzmunu silindi."); }
  return <section className="about-editor"><div className="admin-section-title"><div><span className="eyebrow">ABOUT SƏHİFƏSİ</span><h2>Haqqımda məzmunu</h2></div><div className="editor-tabs"><button className={locale === "az" ? "selected" : ""} onClick={() => switchLocale("az")}>AZ</button><button className={locale === "en" ? "selected" : ""} onClick={() => switchLocale("en")}>EN</button></div></div><form onSubmit={save}><label>Başlıq<input value={form.greeting} onChange={(e) => update("greeting", e.target.value)} placeholder="Salam, mən Fadilayam." required /></label><label>Giriş mətni<textarea rows={4} value={form.lead} onChange={(e) => update("lead", e.target.value)} required /></label><div className="about-value-editor">{form.values.map((item, index) => <div key={index}><span>0{index + 1}</span><input value={item.title} onChange={(e) => updateValue(index, "title", e.target.value)} placeholder="Məsələn: Yaratmaq" required /><textarea rows={2} value={item.text} onChange={(e) => updateValue(index, "text", e.target.value)} placeholder="Qısa açıqlama" required /></div>)}</div>{message && <p className="admin-message">{message}</p>}<div className="editor-actions"><button className="primary-button" type="submit">About-u yadda saxla</button><button className="subtle-button" type="button" onClick={remove}>Bu dili sil</button></div></form></section>;
}
