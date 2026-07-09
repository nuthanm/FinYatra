"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ToolPageShell } from "@/components/calculator/CalculatorUi";
import { FyIcon } from "@/components/FyIcon";
import { ToolCollection, ViewToggle } from "@/components/ToolCollection";
import { useT } from "@/components/providers/I18nProvider";
import { CONTACT_EMAIL, SITE_PAGES, pageHref } from "@/lib/config/site";
import {
  buildSearchSuggestions,
  defaultSearchSuggestions,
  searchTools,
} from "@/lib/search";
import { sitePageDescription, sitePageTitle } from "@/lib/site-page-localization";

function PolicyUpdated() {
  const t = useT();
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    );
  }, []);

  return (
    <p className="fy-policy-updated">
      {t("Common_LastUpdated")} {date ?? "—"}
    </p>
  );
}

export function AboutPage() {
  const t = useT();
  return (
    <ToolPageShell
      title={t("Page_About_Title")}
      subtitle={t("Page_About_Subtitle")}
      description={t("Page_About_Description")}
      icon="compass"
    >
      <PolicyUpdated />

      <div className="fy-form-card">
        <h3>{t("Page_About_MissionHeading")}</h3>
        <p className="fy-audience">{t("Page_About_MissionBody")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_About_OfferHeading")}</h3>
        <ul className="fy-info-list">
          <li>{t("Page_About_Offer1")}</li>
          <li>{t("Page_About_Offer2")}</li>
          <li>{t("Page_About_Offer3")}</li>
          <li>{t("Page_About_Offer4")}</li>
        </ul>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_About_MaintainerHeading")}</h3>
        <p className="fy-audience">{t("Page_About_MaintainerBody")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_About_DisclaimerHeading")}</h3>
        <p className="fy-audience">{t("Page_About_DisclaimerBody")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_About_ContactHeading")}</h3>
        <p className="fy-audience">
          {t("Page_About_ContactBody")}{" "}
          <Link className="fy-inline-link" href="/contact">
            {t("Common_ContactPageLink")}
          </Link>{" "}
          ·{" "}
          <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </ToolPageShell>
  );
}

export function PrivacyPage() {
  const t = useT();
  return (
    <ToolPageShell
      title={t("Page_Privacy_Title")}
      subtitle={t("Page_Privacy_Subtitle")}
      description={t("Page_Privacy_Description")}
    >
      <PolicyUpdated />

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S01_Title")}</h3>
        <p className="fy-audience">
          {t("Page_Privacy_S01_Body")}{" "}
          <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S02_Title")}</h3>
        <ul className="fy-info-list">
          <li>{t("Page_Privacy_S02_L1")}</li>
          <li>{t("Page_Privacy_S02_L2")}</li>
          <li>{t("Page_Privacy_S02_L3")}</li>
          <li>{t("Page_Privacy_S02_L4")}</li>
        </ul>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S03_Title")}</h3>
        <p className="fy-audience">{t("Page_Privacy_S03_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S04_Title")}</h3>
        <p className="fy-audience">{t("Page_Privacy_S04_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S05_Title")}</h3>
        <p className="fy-audience">{t("Page_Privacy_S05_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S06_Title")}</h3>
        <p className="fy-audience">
          {t("Page_Privacy_S06_Body")}{" "}
          <a className="fy-inline-link" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            {t("Page_Privacy_S06_LinkAds")}
          </a>{" "}
          {t("Page_Privacy_S06_BodyAfter")}{" "}
          <a
            className="fy-inline-link"
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Page_Privacy_S06_LinkPolicy")}
          </a>
          .
        </p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S07_Title")}</h3>
        <p className="fy-audience">{t("Page_Privacy_S07_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S08_Title")}</h3>
        <ul className="fy-info-list">
          <li>{t("Page_Privacy_S08_L1")}</li>
          <li>{t("Page_Privacy_S08_L2")}</li>
          <li>{t("Page_Privacy_S08_L3")}</li>
          <li>{t("Page_Privacy_S08_L4")}</li>
        </ul>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S09_Title")}</h3>
        <p className="fy-audience">{t("Page_Privacy_S09_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Privacy_S10_Title")}</h3>
        <p className="fy-audience">{t("Page_Privacy_S10_Body")}</p>
      </div>
    </ToolPageShell>
  );
}

export function TermsPage() {
  const t = useT();
  return (
    <ToolPageShell
      title={t("Page_Terms_Title")}
      subtitle={t("Page_Terms_Subtitle")}
      description={t("Page_Terms_Description")}
    >
      <PolicyUpdated />

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S01_Title")}</h3>
        <p className="fy-audience">
          {t("Page_Terms_S01_Body")}{" "}
          <Link className="fy-inline-link" href="/privacy">
            {t("Page_Terms_S01_LinkPrivacy")}
          </Link>
          . {t("Page_Terms_S01_BodyAfter")}
        </p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S02_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S02_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S03_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S03_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S04_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S04_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S05_Title")}</h3>
        <ul className="fy-info-list">
          <li>{t("Page_Terms_S05_L1")}</li>
          <li>{t("Page_Terms_S05_L2")}</li>
          <li>{t("Page_Terms_S05_L3")}</li>
        </ul>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S06_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S06_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S07_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S07_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S08_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S08_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S09_Title")}</h3>
        <p className="fy-audience">{t("Page_Terms_S09_Body")}</p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S10_Title")}</h3>
        <p className="fy-audience">
          {t("Page_Terms_S10_Body")}{" "}
          <a className="fy-inline-link" href="https://lucide.dev" target="_blank" rel="noopener noreferrer">
            {t("Page_Terms_S10_LinkLucide")}
          </a>{" "}
          /{" "}
          <a className="fy-inline-link" href="https://feathericons.com" target="_blank" rel="noopener noreferrer">
            Feather
          </a>{" "}
          {t("Page_Terms_S10_BodyMid")}{" "}
          <a className="fy-inline-link" href="https://rsms.me/inter/" target="_blank" rel="noopener noreferrer">
            {t("Page_Terms_S10_LinkInter")}
          </a>{" "}
          {t("Page_Terms_S10_BodyAfter")}{" "}
          <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          {t("Page_Terms_S10_BodyEnd")}
        </p>
      </div>

      <div className="fy-form-card">
        <h3>{t("Page_Terms_S11_Title")}</h3>
        <p className="fy-audience">
          {t("Page_Terms_S11_Body")}{" "}
          <a className="fy-inline-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </ToolPageShell>
  );
}

export function SitemapPage() {
  const t = useT();
  return (
    <ToolPageShell
      title={t("Page_Sitemap_Title")}
      subtitle={t("Page_Sitemap_Subtitle")}
      description={t("Page_Sitemap_Description")}
      icon="list"
    >
      <div className="fy-form-card">
        <p className="fy-audience">
          {t("Page_Sitemap_Intro")}{" "}
          <a className="fy-inline-link" href="/sitemap.xml" target="_blank" rel="noopener">
            sitemap.xml
          </a>{" "}
          ·{" "}
          <a className="fy-inline-link" href="/robots.txt" target="_blank" rel="noopener">
            robots.txt
          </a>
        </p>
      </div>

      <div className="fy-sitemap-list">
        {SITE_PAGES.map((page) => (
          <Link key={page.route} className="fy-sitemap-item" href={pageHref(page.route)}>
            <span className="fy-sitemap-title">{sitePageTitle(t, page)}</span>
            <span className="fy-sitemap-desc">{sitePageDescription(t, page)}</span>
            <span className="fy-sitemap-path">{pageHref(page.route)}</span>
          </Link>
        ))}
      </div>
    </ToolPageShell>
  );
}

export function SearchPage() {
  const t = useT();
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();

  const results = useMemo(() => searchTools(query, t), [query, t]);
  const suggestions = useMemo(() => {
    if (!query) return defaultSearchSuggestions();
    return buildSearchSuggestions(query, results);
  }, [query, results]);

  const subtitle = query
    ? t("Page_Search_SubtitleResults", String(results.length), query)
    : t("Page_Search_SubtitleEmpty");

  return (
    <ToolPageShell
      title={t("Page_Search_Title")}
      subtitle={subtitle}
      description={t("Page_Search_Description")}
      icon="search"
    >
      <div className="fy-form-card">
        <div className="fy-searchpage-head">
          <div>
            <h3>{t("Page_Search_ResultsHeading")}</h3>
            <p className="fy-comingsoon-sub">{subtitle}</p>
          </div>
          <ViewToggle />
        </div>

        {results.length > 0 ? (
          <ToolCollection tools={results} />
        ) : (
          <>
            <div className="fy-empty-state">
              <div className="fy-empty-ic">
                <FyIcon name="search" size={22} />
              </div>
              <div className="fy-empty-title">{t("Page_Search_NoResultsTitle")}</div>
              <div className="fy-empty-text">{t("Page_Search_NoResultsBody", query)}</div>
            </div>

            <div className="fy-suggest">
              <div className="fy-suggest-title">{t("Page_Search_SuggestedHeading")}</div>
              <ToolCollection tools={suggestions} />
            </div>
          </>
        )}
      </div>
    </ToolPageShell>
  );
}
