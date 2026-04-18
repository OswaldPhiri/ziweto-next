// src/components/AdminPanel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";
import { Product, CATEGORIES, Category } from "@/types";
import { formatPrice, slugify } from "@/lib/utils";
import ImageUpload from "./ImageUpload";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface FormState {
  name: string;
  price: string;
  category: Category | "";
  shortDesc: string;
  description: string;
  image: string;
  imagesExtra: string;
  sellerName: string;
  sellerWhatsapp: string;
  sellerLocation: string;
  sellerId: string;
}

const EMPTY_FORM: FormState = {
  name: "", price: "", category: "", shortDesc: "", description: "",
  image: "", imagesExtra: "", sellerName: "", sellerWhatsapp: "",
  sellerLocation: "", sellerId: "",
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function authHeader(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function AdminPanel() {
  const [user,        setUser]        = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Products
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading,  setLoading]    = useState(false);

  // Edit form
  const [showForm,   setShowForm]   = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [form,       setForm]       = useState<FormState>(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [formErr,    setFormErr]    = useState("");
  const [formOk,     setFormOk]     = useState("");

  // ── Auth listener ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ── Load products when logged in ──
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadProducts();
  }, [user, loadProducts]);

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginErr("Incorrect email or password. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  }

  // ── Logout ──
  async function handleLogout() {
    await signOut(auth);
    setProducts([]);
    setShowForm(false);
  }

  // ── Open form (new) ──
  function openNewForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErr("");
    setFormOk("");
    setShowForm(true);
    setTimeout(() => document.getElementById("admin-form-top")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  // ── Open form (edit) ──
  function openEditForm(p: Product) {
    setEditingId(p.id);
    setForm({
      name:           p.name,
      price:          String(p.price),
      category:       p.category,
      shortDesc:      p.shortDesc,
      description:    p.description,
      image:          p.image,
      imagesExtra:    (p.images ?? []).join("\n"),
      sellerName:     p.seller.name,
      sellerWhatsapp: p.seller.whatsapp,
      sellerLocation: p.seller.location,
      sellerId:       p.seller.id,
    });
    setFormErr("");
    setFormOk("");
    setShowForm(true);
    setTimeout(() => document.getElementById("admin-form-top")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErr("");
    setFormOk("");
  }

  async function resolveExtraLinks(text: string) {
    const lines = text.split("\n");
    let changed = false;
    const resolvedLines = await Promise.all(lines.map(async (line) => {
      const trimmed = line.trim();
      if (trimmed && (trimmed.includes("pin.it") || trimmed.includes("pinterest.com/pin")) && !trimmed.includes("i.pinimg.com")) {
        try {
          const res = await fetch(`/api/resolve-link?url=${encodeURIComponent(trimmed)}`);
          const data = await res.json();
          if (data.url) {
            changed = true;
            return data.url;
          }
        } catch (err) {
          console.error("Failed to resolve extra link", err);
        }
      }
      return line;
    }));

    if (changed) {
      setForm((prev) => ({ ...prev, imagesExtra: resolvedLines.join("\n") }));
    }
  }

  function setField(key: keyof FormState, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key === "imagesExtra" && val.length > 5) {
      // Debounce or just trigger on newline
      if (val.endsWith("\n") || val.split("\n").length > 0) {
        resolveExtraLinks(val);
      }
    }
  }

  // ── Save ──
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormErr("");
    setFormOk("");

    const { name, price, category, shortDesc, sellerName, sellerWhatsapp } = form;
    if (!name || !price || !category || !shortDesc || !sellerName || !sellerWhatsapp) {
      setFormErr("Please fill in all required fields (*).");
      return;
    }
    if (isNaN(Number(price)) || Number(price) < 0) {
      setFormErr("Please enter a valid price.");
      return;
    }

    setSaving(true);
    const headers = await authHeader();

    const body = {
      name: name.trim(),
      price: Number(price),
      category,
      shortDesc: shortDesc.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      images: form.imagesExtra.split("\n").map((s) => s.trim()).filter(Boolean),
      seller: {
        name:     sellerName.trim(),
        whatsapp: sellerWhatsapp.trim(),
        location: form.sellerLocation.trim(),
        id:       form.sellerId.trim() || slugify(sellerName.trim()),
      },
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT", headers, body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Update failed");
        setFormOk("Listing updated.");
      } else {
        const res = await fetch("/api/products", {
          method: "POST", headers, body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Create failed");
        setFormOk("Listing added.");
        setForm(EMPTY_FORM);
        setEditingId(null);
      }
      await loadProducts();
    } catch (err: unknown) {
      setFormErr((err as Error).message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const headers = await authHeader();
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE", headers });
      await loadProducts();
    } catch {
      alert("Could not delete. Please try again.");
    }
  }

  // ─────────────────────────────────────────────
  // Render: loading
  // ─────────────────────────────────────────────
  if (authLoading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20 text-gray-400 text-sm">
        Loading…
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // Render: login gate
  // ─────────────────────────────────────────────
  if (!user) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Admin Panel</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to manage listings.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#25D366] transition-colors"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#25D366] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {loginErr && <p className="text-xs text-red-500 text-center">{loginErr}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-[#25D366] hover:bg-[#128C4C] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              {loggingIn ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5">
            Set up your admin account in the Firebase Console under Authentication → Users.
          </p>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // Render: dashboard
  // ─────────────────────────────────────────────
  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">

      {/* Dashboard header */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Listings</h2>
          <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openNewForm}
            className="px-4 py-2 bg-[#25D366] hover:bg-[#128C4C] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + Add Listing
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 text-sm font-medium rounded-xl transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div id="admin-form-top" className="bg-white rounded-2xl border border-gray-200 shadow-md p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">{editingId ? "Edit Listing" : "Add New Listing"}</h3>
            <button onClick={closeForm} className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-sm flex items-center justify-center transition-colors">✕</button>
          </div>

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Product name */}
              <div className="sm:col-span-2">
                <label className="label">Product Name *</label>
                <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Samsung Galaxy A15" className="field" />
              </div>

              {/* Price */}
              <div>
                <label className="label">Price (MWK) *</label>
                <input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="e.g. 85000" min="0" className="field" />
              </div>

              {/* Category */}
              <div>
                <label className="label">Category *</label>
                <select value={form.category} onChange={(e) => setField("category", e.target.value as Category)} className="field">
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Short description */}
              <div className="sm:col-span-2">
                <label className="label">Short Description * <span className="font-normal text-gray-400">(shown on listing card)</span></label>
                <input value={form.shortDesc} onChange={(e) => setField("shortDesc", e.target.value)} maxLength={120} placeholder="One sentence about the product" className="field" />
              </div>

              {/* Full description */}
              <div className="sm:col-span-2">
                <label className="label">Full Description</label>
                <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={4} placeholder="Condition, specs, delivery info…" className="field resize-y" />
              </div>

              {/* Main image — drag/drop upload or URL */}
              <div className="sm:col-span-2">
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setField("image", url)}
                  label="Main Image *"
                  getToken={() => auth.currentUser!.getIdToken()}
                />
              </div>

              {/* Extra images */}
              <div className="sm:col-span-2">
                <label className="label">Extra Image URLs <span className="font-normal text-gray-400">(optional — one per line)</span></label>
                <textarea 
                  value={form.imagesExtra} 
                  onChange={(e) => setField("imagesExtra", e.target.value)} 
                  rows={3} 
                  placeholder={"https://…\nhttps://…"} 
                  className={`field resize-y font-mono text-xs ${form.imagesExtra ? 'rounded-b-none border-b-0' : ''}`} 
                />
                
                {/* Extra images previews */}
                {form.imagesExtra.trim() && (
                  <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-xl p-3 flex flex-wrap gap-2">
                    {form.imagesExtra.split("\n").map((url, i) => {
                      const trimmed = url.trim();
                      if (!trimmed || !trimmed.startsWith("http")) return null;
                      return (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white group">
                          <img src={trimmed} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => {
                                const lines = form.imagesExtra.split("\n");
                                lines.splice(i, 1);
                                setField("imagesExtra", lines.join("\n"));
                              }}
                              className="text-white text-[10px] font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                      +
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-400 mt-1">Paste direct image links, one per line. You can also upload to <a href="https://imgbb.com" target="_blank" rel="noopener" className="text-[#128C4C] underline font-medium">imgbb.com</a> and paste the link.</p>
              </div>

              {/* Divider */}
              <div className="sm:col-span-2 border-t border-gray-100 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Seller Information</p>
              </div>

              {/* Seller name */}
              <div>
                <label className="label">Seller Name *</label>
                <input value={form.sellerName} onChange={(e) => setField("sellerName", e.target.value)} placeholder="e.g. Mphatso Hardware" className="field" />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="label">WhatsApp Number *</label>
                <input type="tel" value={form.sellerWhatsapp} onChange={(e) => setField("sellerWhatsapp", e.target.value)} placeholder="265XXXXXXXXX" className="field" />
              </div>

              {/* Location */}
              <div>
                <label className="label">Location</label>
                <input value={form.sellerLocation} onChange={(e) => setField("sellerLocation", e.target.value)} placeholder="e.g. Lilongwe, Area 18" className="field" />
              </div>

              {/* Seller ID */}
              <div>
                <label className="label">Seller ID <span className="font-normal text-gray-400">(for grouping)</span></label>
                <input value={form.sellerId} onChange={(e) => setField("sellerId", e.target.value)} placeholder="e.g. mphatso-hardware" className="field" />
              </div>

            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
              <button type="button" onClick={closeForm} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:border-gray-400 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-[#25D366] hover:bg-[#128C4C] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
                {saving ? "Saving…" : editingId ? "Update Listing" : "Add Listing"}
              </button>
            </div>

            {formErr && <p className="text-red-500 text-xs text-center mt-3">{formErr}</p>}
            {formOk  && <p className="text-[#128C4C] text-xs text-center mt-3 font-medium">{formOk}</p>}
          </form>
        </div>
      )}

      {/* ── Listings table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-sm text-gray-400">Loading listings…</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-gray-600 mb-1">No listings yet</p>
            <p className="text-sm">Click "Add Listing" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Seller</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 max-w-[180px] truncate">{p.name}</td>
                    <td className="px-4 py-3 capitalize text-gray-500 hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{p.seller.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(p)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-gray-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="px-3 py-1.5 border border-red-100 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </main>
  );
}
