import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Header from "@/components/Header";
import CommissionCard from "@/components/CommissionCard";
import { categories, commissions } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COWATIST — Art Commission Marketplace" },
      { name: "description", content: "Find talented artists and commission custom artwork. Browse pixel art, chibi, fantasy, landscapes and more." },
      { property: "og:title", content: "COWATIST — Art Commission Marketplace" },
      { property: "og:description", content: "Find talented artists and commission custom artwork." },
    ],
  }),
  component: Index,
});

function Index() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = commissions.filter((c) => {
    const matchesSearch =
      !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header searchValue={search} onSearchChange={setSearch} onSearch={setSearch} />

      {/* Mobile categories */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Categories sidebar */}
        <aside className="hidden w-52 shrink-0 border-r border-border p-5 lg:block">
          <h2 className="font-display text-lg font-bold">Categories</h2>
          <div className="mt-1 mb-3 h-0.5 w-24 bg-foreground" />
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`text-sm transition-colors hover:text-primary ${
                    activeCategory === cat ? "font-semibold text-primary" : "text-foreground"
                  }`}
                >
                  • {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-4 sm:p-6">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">No commissions found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <CommissionCard key={c.id} commission={c} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
