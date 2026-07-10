"use client";

import Link from "next/link";
import { FyIcon } from "@/components/FyIcon";
import { useT } from "@/components/providers/I18nProvider";
import { groupLabelKey, toolsByGroup } from "@/lib/config/tools";

const FOOTER_GROUPS = ["Planning", "Investing", "Loans", "Tax"] as const;
const FOOTER_PREVIEW = 5;

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="fy-footer">
      <div className="fy-footer-watermark" aria-hidden>
        {t("App_Title")}
      </div>
      <div className="fy-footer-inner">
        <div className="fy-footer-grid">
          {FOOTER_GROUPS.map((group) => {
            const tools = toolsByGroup(group).slice(0, FOOTER_PREVIEW);
            return (
              <div key={group} className="fy-footer-col">
                <h3 className="fy-footer-col-title">{t(groupLabelKey(group))}</h3>
                <ul className="fy-footer-col-links">
                  {tools.map((tool) => (
                    <li key={tool.key}>
                      <Link href={tool.route}>
                        {t(tool.titleKey)}
                        {tool.comingSoon ? <span className="fy-footer-soon">{t("Label_Soon")}</span> : null}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link className="fy-footer-more" href={`/tools/${group}`}>
                      {t("Footer_ViewAllTools")} →
                    </Link>
                  </li>
                </ul>
              </div>
            );
          })}
          <div className="fy-footer-col fy-footer-col-brand">
            <h3 className="fy-footer-col-title">{t("Footer_Col_Company")}</h3>
            <p className="fy-footer-tagline">{t("Footer_Tagline")}</p>
            <ul className="fy-footer-col-links">
              <li>
                <Link href="/tools">{t("Nav_AllTools")}</Link>
              </li>
              <li>
                <Link href="/about">{t("Footer_About")}</Link>
              </li>
              <li>
                <Link href="/contact">{t("Footer_Contact")}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="fy-footer-bar">
          <div className="fy-footer-meta">
            <span>
              {t("Footer_MadeWith")}{" "}
              <span className="fy-heart" aria-hidden>
                <FyIcon name="heart" size={14} />
              </span>{" "}
              {t("Footer_By")} <strong>Nuthan Murarysetty</strong>
            </span>
            <span className="fy-footer-dot">·</span>
            <span>
              © {year} {t("App_Title")}. {t("Footer_Rights")}
            </span>
          </div>
          <p className="fy-footer-disclaimer">{t("Footer_Disclaimer")}</p>
          <nav className="fy-footer-links" aria-label={t("Nav_FooterAria")}>
            <Link href="/sitemap">{t("Footer_Sitemap")}</Link>
            <span className="fy-footer-sep">|</span>
            <Link href="/privacy">{t("Footer_Privacy")}</Link>
            <span className="fy-footer-sep">|</span>
            <Link href="/terms">{t("Footer_Terms")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
