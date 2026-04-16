import { Link } from "@tanstack/react-router";
import { Search, Menu, Heart } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (query: string) => void;
}

export default function Header({ searchValue, onSearchChange, onSearch }: HeaderProps) {
  const [query, setQuery] = useState(searchValue ?? "");

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-header px-4 py-3 text-header-foreground sm:px-6">
      <Link to="/" className="shrink-0">
        <div className="text-center leading-tight">
          <h1 className="font-display text-lg font-bold tracking-wider sm:text-xl">COWATIST</h1>
          <p className="text-[0.65rem] tracking-widest opacity-80">コーワチッツ</p>
        </div>
      </Link>

      <div className="mx-auto flex w-full max-w-lg items-center gap-2 rounded-md bg-header-foreground/10 px-3 py-1.5 backdrop-blur-sm">
        <Menu className="h-4 w-4 shrink-0 opacity-60" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch?.(query);
          }}
          className="w-full bg-transparent text-sm placeholder:text-header-foreground/50 focus:outline-none"
        />
        <button onClick={() => onSearch?.(query)} aria-label="Search">
          <Search className="h-4 w-4 shrink-0 opacity-60" />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full bg-gradient-to-br from-primary to-accent" />
        </div>
        <Link to="/" aria-label="Favorites">
          <Heart className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
