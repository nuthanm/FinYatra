"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { FyIcon } from "@/components/FyIcon";
import { Footer } from "@/components/layout/Footer";
import { ScrollNav } from "@/components/layout/ScrollNav";
import { useI18n } from "@/components/providers/I18nProvider";
import { SUPPORTED, type Locale } from "@/lib/i18n";
import {
  TOOL_GROUPS,
  TOOLS,
  groupLabelKey,
  sidebarToolsForGroup,
  toolsByGroup,
} from "@/lib/config/tools";

function NavLink({ href, title, children, matchAll }: { href: string; title: string; children: ReactNode; matchAll?: boolean }) {
  const pathname = usePathname();
  const active = matchAll ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={`fy-side-link${active ? " active" : ""}`} title={title} onClick={() => {}}>
      {children}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const direct = TOOLS.find((tool) => tool.key.toLowerCase() === q.toLowerCase());
    if (direct) {
      router.push(direct.route);
      setQuery("");
      setNavOpen(false);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setNavOpen(false);
  };

  const calculatorGroups = TOOL_GROUPS;

  return (
    <div className={`fy-shell${navOpen ? " fy-nav-open" : ""}${collapsed ? " fy-collapsed" : ""}`}>
      <header className="fy-topbar">
        <button type="button" className="fy-icon-btn fy-hamburger" onClick={() => setNavOpen(!navOpen)} aria-label={t("Nav_OpenMenu")}>
          <FyIcon name="menu" size={22} />
        </button>
        <button type="button" className="fy-icon-btn fy-collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label={t("Nav_CollapseSidebar")}>
          <FyIcon name="chevron-left" size={20} />
        </button>
        <Link className="fy-brand" href="/" onClick={() => setNavOpen(false)}>
          <span className="fy-brand-name">{t("App_Title")}</span>
        </Link>
        <form className="fy-search" role="search" onSubmit={onSearch}>
          <span className="fy-search-ic">
            <FyIcon name="search" size={18} />
          </span>
          <input
            type="search"
            className="fy-search-input"
            placeholder={t("Nav_SearchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("Nav_SearchAria")}
          />
          <button type="submit" className="fy-search-go" aria-label={t("Nav_SearchGoAria")}>
            <FyIcon name="chevron-right" size={18} />
          </button>
        </form>
        <div className="fy-topbar-right">
          <select
            className="fy-lang fy-lang-desktop"
            aria-label={t("Nav_LanguageAria")}
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            {SUPPORTED.map((c) => (
              <option key={c.code} value={c.code}>
                {c.nativeName}
              </option>
            ))}
          </select>
          <label className="fy-lang-mobile" aria-label={t("Nav_LanguageAria")}>
            <FyIcon name="globe" size={18} />
            <select
              className="fy-lang-mobile-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              {SUPPORTED.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.nativeName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="fy-body">
        <aside className="fy-sidebar">
          <nav className="fy-side-nav" aria-label={t("Nav_PrimaryAria")} onClick={() => setNavOpen(false)}>
            <div className="fy-side-group">
              <div className="fy-side-label">{t("Group_Overview")}</div>
              <NavLink href="/" title={t("Nav_Home")} matchAll>
                <FyIcon name="home" /> <span>{t("Nav_Home")}</span>
              </NavLink>
              <NavLink href="/tools" title={t("Nav_AllTools")}>
                <FyIcon name="grid" /> <span>{t("Nav_AllTools")}</span>
              </NavLink>
            </div>

            {calculatorGroups.map((group) => {
              const preview = sidebarToolsForGroup(group);
              const allInGroup = toolsByGroup(group);
              if (!allInGroup.length) return null;
              return (
                <div key={group} className="fy-side-group">
                  <div className="fy-side-label">{t(groupLabelKey(group))}</div>
                  {preview.map((tool) => (
                    <NavLink key={tool.key} href={tool.route} title={t(tool.titleKey)}>
                      <FyIcon name={tool.icon} /> <span>{t(tool.titleKey)}</span>
                    </NavLink>
                  ))}
                  <NavLink href={`/tools/${group}`} title={t("Nav_ViewGroup", t(groupLabelKey(group)))}>
                    <FyIcon name="chevron-right" /> <span className="fy-side-more">{t("Nav_ViewGroup", t(groupLabelKey(group)))}</span>
                  </NavLink>
                </div>
              );
            })}

            <div className="fy-side-group">
              <div className="fy-side-label">{t("Group_More")}</div>
              <NavLink href="/about" title={t("Nav_About")}>
                <FyIcon name="compass" /> <span>{t("Nav_About")}</span>
              </NavLink>
              <NavLink href="/contact" title={t("Nav_Contact")}>
                <FyIcon name="mail" /> <span>{t("Nav_Contact")}</span>
              </NavLink>
              <NavLink href="/sitemap" title={t("Nav_Sitemap")}>
                <FyIcon name="list" /> <span>{t("Nav_Sitemap")}</span>
              </NavLink>
              <NavLink href="/privacy" title={t("Nav_Privacy")}>
                <FyIcon name="shield" /> <span>{t("Nav_Privacy")}</span>
              </NavLink>
              <NavLink href="/terms" title={t("Nav_Terms")}>
                <FyIcon name="file" /> <span>{t("Nav_Terms")}</span>
              </NavLink>
            </div>
          </nav>
        </aside>

        <button type="button" className="fy-backdrop" aria-label={t("Nav_CloseMenu")} onClick={() => setNavOpen(false)} />

        <div className="fy-content">
          <main className="fy-main">{children}</main>
          <Footer />
        </div>
      </div>
      <ScrollNav />
    </div>
  );
}
