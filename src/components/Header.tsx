import { Link } from "@tanstack/react-router";
import { Search, Menu, Heart, LogIn, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (query: string) => void;
}

export default function Header({ searchValue, onSearchChange, onSearch }: HeaderProps) {
  const [query, setQuery] = useState(searchValue ?? "");
  const { user } = useAuth();

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
        {user ? (
          <Link
            to="/profile"
            aria-label="Your profile"
            className="block h-8 w-8 overflow-hidden rounded-full bg-muted ring-2 ring-transparent transition hover:ring-header-foreground/50"
            title="Your profile"
          >
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
              {user.email?.[0]?.toUpperCase() ?? <UserIcon className="h-4 w-4" />}
            </div>
          </Link>
        ) : (
          <Link
            to="/auth"
            aria-label="Sign in"
            className="inline-flex items-center gap-1.5 rounded-full bg-header-foreground/10 px-3 py-1 text-xs font-semibold transition hover:bg-header-foreground/20"
          >
            <LogIn className="h-3.5 w-3.5" /> Sign in
          </Link>
        )}
        <Link to="/favorites" aria-label="Your commissions" className="transition-colors hover:text-primary">
          <Heart className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
