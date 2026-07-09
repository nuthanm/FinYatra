"use client";

import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HeroDashboardPreview } from "@/components/HeroDashboardPreview";
import { ToolCollection, ViewToggle } from "@/components/ToolCollection";
import { useT } from "@/components/providers/I18nProvider";
import { TOOLS, groupLabelKey } from "@/lib/config/tools";
import type { ToolGroup } from "@/lib/types";

export function HomePage() {
  const t = useT();

  return (
    <>
      <section className="fy-hero">
        <div className="fy-hero-inner">
          <div className="fy-hero-copy">
            <span className="fy-badge">
              <span className="fy-badge-dot" /> {t("Home_Badge")}
            </span>
            <h1>
              {t("Home_H1_Before")}
              <span className="fy-grad-text">{t("Home_H1_Highlight")}</span>
              {t("Home_H1_After")}
            </h1>
            <p className="fy-hero-sub">{t("Home_Sub")}</p>
            <div className="fy-hero-cta">
              <Link className="fy-btn fy-btn-primary" href="/tools">
                {t("Home_CtaExplore")}
              </Link>
              <Link className="fy-btn fy-btn-secondary" href="/goal">
                {t("Home_CtaGoal")}
              </Link>
            </div>
          </div>

          <div className="fy-hero-art" aria-hidden>
            <div className="fy-hero-art-glow" aria-hidden />
            <div className="fy-hero-art-frame">
              <HeroDashboardPreview />
            </div>
          </div>

          <div className="fy-hero-stats">
            <div className="fy-stat">
              <div className="fy-stat-value">8+</div>
              <div className="fy-stat-label">{t("Home_StatTools")}</div>
            </div>
            <div className="fy-stat">
              <div className="fy-stat-value">100%</div>
              <div className="fy-stat-label">{t("Home_StatFree")}</div>
            </div>
            <div className="fy-stat">
              <div className="fy-stat-value">₹0</div>
              <div className="fy-stat-label">{t("Home_StatSignup")}</div>
            </div>
            <div className="fy-stat">
              <div className="fy-stat-value">Aa</div>
              <div className="fy-stat-label">{t("Home_StatLearn")}</div>
            </div>
          </div>
        </div>
      </section>

      <AdSlot enabled={false} />

      <section className="fy-kpi-row fy-home-reveal" aria-label={t("Home_QuickToolsAria")}>
        <Link className="fy-kpi" href="/goal">
          <div className="fy-kpi-title">{t("Home_KpiReachGoal")}</div>
          <div className="fy-kpi-value">{t("Nav_GoalPlanner")}</div>
          <div className="fy-kpi-foot">{t("Home_KpiGoalFoot")}</div>
        </Link>
        <Link className="fy-kpi" href="/sip">
          <div className="fy-kpi-title">{t("Home_KpiStartInvest")}</div>
          <div className="fy-kpi-value">{t("Tool_sip_Title")}</div>
          <div className="fy-kpi-foot">{t("Home_KpiSipFoot")}</div>
        </Link>
        <Link className="fy-kpi" href="/emi">
          <div className="fy-kpi-title">{t("Home_KpiPlanLoan")}</div>
          <div className="fy-kpi-value">{t("Tool_emi_Title")}</div>
          <div className="fy-kpi-foot">{t("Home_KpiEmiFoot")}</div>
        </Link>
        <Link className="fy-kpi" href="/inflation">
          <div className="fy-kpi-title">{t("Home_KpiUnderstandInflation")}</div>
          <div className="fy-kpi-value">{t("Nav_Inflation")}</div>
          <div className="fy-kpi-foot">{t("Home_KpiInflationFoot")}</div>
        </Link>
        <Link className="fy-kpi" href="/fd-laddering">
          <div className="fy-kpi-title">{t("Home_KpiPlanLiquidity")}</div>
          <div className="fy-kpi-value">{t("Nav_FdLaddering")}</div>
          <div className="fy-kpi-foot">{t("Home_KpiFdFoot")}</div>
        </Link>
      </section>

      <section className="fy-section fy-home-reveal" aria-label={t("Home_GainAria")}>
        <h2 className="fy-section-title">{t("Home_GainTitle")}</h2>
        <div className="fy-learn-grid">
          <div className="fy-learn-card">
            <div className="fy-learn-title">{t("Home_GainWhyTitle")}</div>
            <div className="fy-learn-text">{t("Home_GainWhyText")}</div>
          </div>
          <div className="fy-learn-card">
            <div className="fy-learn-title">{t("Home_GainFormulaTitle")}</div>
            <div className="fy-learn-text">{t("Home_GainFormulaText")}</div>
          </div>
          <div className="fy-learn-card">
            <div className="fy-learn-title">{t("Home_GainExampleTitle")}</div>
            <div className="fy-learn-text">{t("Home_GainExampleText")}</div>
          </div>
        </div>
      </section>

      <section className="fy-section" aria-label={t("Home_AllToolsAria")}>
        <div className="fy-section-head">
          <h2 className="fy-section-title">{t("Home_AllTools")}</h2>
          <ViewToggle />
        </div>
        <ToolCollection tools={TOOLS} />
      </section>
    </>
  );
}

const GROUPS: ToolGroup[] = ["Planning", "Investing", "Loans", "Basics"];

export function ToolsPage({ group }: { group?: string }) {
  const t = useT();
  const activeGroup = GROUPS.find((g) => g.toLowerCase() === group?.toLowerCase());
  const filtered = activeGroup ? TOOLS.filter((tool) => tool.group === activeGroup) : TOOLS;

  return (
    <>
      <header className="fy-tool-header">
        <h1>{t("Tools_Title")}</h1>
        <p className="fy-subtitle">{t("Tools_Subtitle")}</p>
        <p className="fy-tool-desc">{t("Tools_Desc")}</p>
      </header>

      <div className="fy-toolbar">
        <div className="fy-tabs" role="tablist" aria-label={t("Tools_CategoriesAria")}>
          <Link className={`fy-tab${!activeGroup ? " active" : ""}`} href="/tools" role="tab" aria-selected={!activeGroup}>
            {t("Tools_TabAll")}
          </Link>
          {GROUPS.map((g) => (
            <Link
              key={g}
              className={`fy-tab${activeGroup === g ? " active" : ""}`}
              href={`/tools/${g}`}
              role="tab"
              aria-selected={activeGroup === g}
            >
              {t(groupLabelKey(g))}
            </Link>
          ))}
        </div>
        <ViewToggle />
      </div>

      <ToolCollection tools={filtered} />
    </>
  );
}
