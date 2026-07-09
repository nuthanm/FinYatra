"use client";

import { useState, type ReactNode } from "react";
import { FyIcon } from "@/components/FyIcon";
import { ShareBlock } from "@/components/ShareBlock";
import { useT } from "@/components/providers/I18nProvider";
import type { SummaryCard } from "@/lib/types";

export function ResultSummaryCards({ cards, ariaLabel }: { cards: SummaryCard[]; ariaLabel?: string }) {
  const t = useT();
  if (!cards.length) return null;

  return (
    <ShareBlock title={t("Common_Summary")}>
      <section className="fy-result-kpis" aria-label={ariaLabel ?? t("Common_ResultSummaryAria")}>
        {cards.map((card) => (
          <div key={card.label} className={`fy-result-kpi fy-result-kpi-${card.variant ?? "default"}`}>
            <div className="fy-result-kpi-label">{card.label}</div>
            <div className="fy-result-kpi-value">{card.value}</div>
            {card.footnote ? <div className="fy-result-kpi-foot">{card.footnote}</div> : null}
          </div>
        ))}
      </section>
    </ShareBlock>
  );
}

export function ScenarioCompare({
  title,
  subtitle,
  scenarios,
}: {
  title: string;
  subtitle?: string;
  scenarios: { name: string; primaryLabel: string; primaryValue: string; secondaryLabel?: string; secondaryValue?: string; variant?: string }[];
}) {
  return (
    <ShareBlock title={title} subtitle={subtitle}>
      <section className="fy-scenario-compare" aria-label={title}>
        {title ? <h3 className="fy-section-title">{title}</h3> : null}
        {subtitle ? <p className="fy-audience">{subtitle}</p> : null}
        <div className="fy-scenario-grid">
          {scenarios.map((s) => (
            <div key={s.name} className={`fy-scenario-card fy-scenario-${s.variant ?? "base"}`}>
              <div className="fy-scenario-name">{s.name}</div>
              <div className="fy-scenario-primary">
                <span className="fy-scenario-label">{s.primaryLabel}</span>
                <span className="fy-scenario-value">{s.primaryValue}</span>
              </div>
              {s.secondaryLabel && s.secondaryValue ? (
                <div className="fy-scenario-secondary">
                  <span className="fy-scenario-label">{s.secondaryLabel}</span>
                  <span className="fy-scenario-value">{s.secondaryValue}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </ShareBlock>
  );
}

export function BreakdownTable({
  title,
  subtitle,
  columns,
  rows,
}: {
  title: string;
  subtitle?: string;
  columns: { key: string; header: string; alignRight?: boolean }[];
  rows: { cells: Record<string, string> }[];
}) {
  return (
    <ShareBlock title={title} subtitle={subtitle}>
      <section className="fy-table-card fy-table-card-flat" aria-label={title}>
        {(title || subtitle) && (
          <div className="fy-table-head">
            <h3>{title}</h3>
            {subtitle ? <span className="fy-table-meta">{subtitle}</span> : null}
          </div>
        )}
        <div className="fy-table-wrap">
          <table className="fy-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={c.alignRight !== false ? "fy-align-right" : undefined}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c.key} className={c.alignRight !== false ? "fy-align-right" : undefined}>
                        {row.cells[c.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="fy-table-empty">
                    —
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ShareBlock>
  );
}

export function FormulaCard({
  title,
  code,
  note,
  steps,
}: {
  title: string;
  code: string;
  note?: string;
  steps?: string[];
}) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      setBusy(true);
      await window.FinYatraShare?.copyText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    } finally {
      setBusy(false);
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="fy-formula-card">
      <div className="fy-formula-card-head">
        <span className="fy-formula-title">{title}</span>
        <button type="button" className="fy-copy-btn" onClick={() => void copy()} disabled={busy} aria-label={t("Common_CopyFormulaAria")}>
          <FyIcon name={copied ? "check" : "copy"} size={15} />
          <span>{copied ? t("Common_Copied") : t("Common_Copy")}</span>
        </button>
      </div>
      <div className="fy-formula-section">
        <div className="fy-formula-kicker">{t("Common_FormulaLabel")}</div>
        <pre className="fy-code">
          <code>{code}</code>
        </pre>
      </div>
      {steps && steps.length > 0 ? (
        <div className="fy-formula-section fy-formula-steps-wrap">
          <div className="fy-formula-kicker">{t("Common_StepByStep")}</div>
          <ol className="fy-formula-steps">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}
      {note ? <p className="fy-formula-note">{note}</p> : null}
    </div>
  );
}

export function WorkedExample({
  title,
  subtitle,
  steps,
  sources,
}: {
  title: string;
  subtitle?: string;
  steps: string[];
  sources?: { label: string; url: string }[];
}) {
  return (
    <ShareBlock title={title} subtitle={subtitle}>
      <section className="fy-worked-example fy-worked-flat" aria-label={title}>
        {subtitle ? (
          <div className="fy-worked-head">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        ) : null}
        <ol className="fy-worked-steps">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {sources && sources.length > 0 ? (
          <div className="fy-worked-sources">
            {sources.map((s) => (
              <a key={s.url} className="fy-inline-link" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        ) : null}
      </section>
    </ShareBlock>
  );
}

export function ToolPageShell({
  title,
  subtitle,
  description,
  icon,
  educate,
  children,
  results,
  below,
  fullWidth,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  educate?: ReactNode;
  children: ReactNode;
  results?: ReactNode;
  below?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <article className="fy-tool-page">
      <header className="fy-tool-header">
        <div className="fy-tool-header-row">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p className="fy-subtitle">{subtitle}</p> : null}
            {description ? <p className="fy-tool-desc">{description}</p> : null}
          </div>
          {icon ? (
            <div className="fy-tool-header-art" aria-hidden>
              <FyIcon name={icon} size={32} />
            </div>
          ) : null}
        </div>
      </header>

      {educate ? (
        <div className="fy-tool-workspace">
          <section className="fy-tool-inputs">{children}</section>
          <aside className="fy-tool-aside">{educate}</aside>
        </div>
      ) : (
        <section className={`fy-tool-col${fullWidth ? "" : " fy-tool-col-wide"}`}>{children}</section>
      )}

      {results ? <section className="fy-tool-output">{results}</section> : null}
      {below ? <section className="fy-tool-below">{below}</section> : null}
    </article>
  );
}

export function ToolInfoPanel({ info }: { info: import("@/lib/types").ToolInfo }) {
  const t = useT();
  if (!info) return null;

  return (
    <ShareBlock title={t("Share_ToolGuide")}>
      <section className="fy-info-panel" aria-label={t("Share_ToolGuide")}>
        <div className="fy-info-grid">
          <div className="fy-info-card">
            <div className="fy-info-k">{t("Info_Abbreviation")}</div>
            <div className="fy-info-v">{info.abbreviation}</div>
          </div>
          <div className="fy-info-card">
            <div className="fy-info-k">{t("Info_Purpose")}</div>
            <div className="fy-info-v">{info.purpose}</div>
          </div>
          <div className="fy-info-card">
            <div className="fy-info-k">{t("Info_WhyKnow")}</div>
            <div className="fy-info-v">{info.whyKnowThis}</div>
          </div>
          <div className="fy-info-card">
            <div className="fy-info-k">{t("Info_RealLife")}</div>
            <div className="fy-info-v">{info.realLifeUse}</div>
          </div>
        </div>

        <div className="fy-info-split">
          <div className="fy-info-section">
            <h3>{t("Info_GoalsForTool")}</h3>
            <ul className="fy-info-list">
              {info.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="fy-info-section">
            <h3>{t("Info_Motto")}</h3>
            <div className="fy-motto">{info.motto}</div>
            <h3>{t("Info_Differentiation")}</h3>
            <p className="fy-info-p">{info.differentiation}</p>
          </div>
        </div>

        {info.alternatives.length > 0 ? (
          <section className="fy-info-section">
            <h3>{t("Info_Alternatives")}</h3>
            <div className="fy-table-wrap">
              <table className="fy-table">
                <thead>
                  <tr>
                    <th>{t("Info_Alternative")}</th>
                    <th>{t("Info_WhenToUse")}</th>
                    <th>{t("Info_Example")}</th>
                    <th>{t("Info_Pros")}</th>
                    <th>{t("Info_Cons")}</th>
                  </tr>
                </thead>
                <tbody>
                  {info.alternatives.map((a) => (
                    <tr key={a.name}>
                      <td>
                        <strong>{a.name}</strong>
                      </td>
                      <td>{a.whenToUse}</td>
                      <td>{a.example}</td>
                      <td>{a.pros}</td>
                      <td>{a.cons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {info.officialLinks.length > 0 ? (
          <section className="fy-info-section">
            <h3>{t("Info_OfficialLinks")}</h3>
            <ul className="fy-links">
              {info.officialLinks.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {info.formulaBlocks.length > 0 ? (
          <section className="fy-info-section">
            <h3>{t("Info_FormulaHowTo")}</h3>
            <p className="fy-info-p fy-formula-intro">{t("Info_FormulaIntro")}</p>
            <div className="fy-formula-stack">
              {info.formulaBlocks.map((block) => (
                <FormulaCard key={block.title} title={block.title} code={block.code} steps={block.steps} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </ShareBlock>
  );
}
